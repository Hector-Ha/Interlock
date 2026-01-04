import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "@/config";
import { prisma } from "@/db";
import { logger } from "@/middleware/logger";

interface WebhookRequest extends Request {
  rawBody?: Buffer;
}

const verifySignature = (req: WebhookRequest): boolean => {
  const signature = req.headers["x-request-signature-sha-256"];
  const secret = config.dwolla.webhookSecret;

  if (!signature || !secret || !req.rawBody) {
    logger.warn(
      "Webhook verification failed: Missing signature, secret, or body"
    );
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const hash = hmac.update(req.rawBody).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature as string),
    Buffer.from(hash)
  );
};

export const handleDwollaWebhook = async (req: Request, res: Response) => {
  try {
    if (!verifySignature(req as WebhookRequest)) {
      res.status(401).json({ message: "Invalid signature" });
      return;
    }

    const event = req.body;
    const topic = event.topic;
    const resourceUrl = event._links.resource.href;
    const resourceId = resourceUrl.split("/").pop();
    const eventId = event.id;

    // Idempotency Check
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      logger.info({ eventId }, "Webhook event already processed");
      res.status(200).send();
      return;
    }

    // We create it first to reserve the ID. If this fails (race condition), it returns 500 (or caught below).
    await prisma.webhookEvent.create({
      data: {
        eventId,
        provider: "dwolla",
        eventType: topic,
        payload: event as any, // Store raw payload
      },
    });

    logger.info({ topic, resourceId, eventId }, "Received Dwolla Webhook");

    switch (topic) {
      case "customer_transfer_completed":
        await updateTransactionStatus(resourceId, "SUCCESS");
        break;

      case "customer_transfer_failed":
      case "customer_transfer_cancelled":
        await updateTransactionStatus(resourceId, "FAILED");
        break;

      case "customer_transfer_returned":
        await updateTransactionStatus(resourceId, "RETURNED");
        break;

      default:
        logger.info({ topic }, "Unhandled webhook topic");
    }

    res.status(200).send();
  } catch (error) {
    logger.error({ err: error }, "Webhook Error");
    res.status(200).send();
  }
};

const updateTransactionStatus = async (
  transferId: string,
  status: "SUCCESS" | "FAILED" | "RETURNED"
): Promise<void> => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { dwollaTransferId: transferId },
    });

    if (!transaction) {
      logger.warn({ transferId }, "Transaction not found for Dwolla transfer");
      return;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status },
    });

    logger.info(
      { transactionId: transaction.id, transferId, status },
      "Updated transaction status"
    );
  } catch (error) {
    logger.error({ err: error, transferId }, "Failed to update transaction");
  }
};
