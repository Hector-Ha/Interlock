import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "@/config";
import { prisma } from "@/db";
import { logger } from "@/middleware/logger";
import { dwollaWebhookSchema } from "@/validators";

interface WebhookRequest extends Request {
  rawBody?: Buffer;
}

const verifySignature = (req: WebhookRequest): boolean => {
  const signature = req.headers["x-request-signature-sha-256"];
  const secret = config.dwolla.webhookSecret;

  if (!signature || !secret || !req.rawBody) {
    logger.warn(
      "Webhook verification failed: Missing signature, secret, or body",
    );
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const hash = hmac.update(req.rawBody).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature as string),
    Buffer.from(hash),
  );
};

export const handleDwollaWebhook = async (req: Request, res: Response) => {
  try {
    if (!verifySignature(req as WebhookRequest)) {
      res.status(401).json({ message: "Invalid signature" });
      return;
    }

    const validation = dwollaWebhookSchema.safeParse(req.body);

    if (!validation.success) {
      logger.warn(
        { errors: validation.error.format() },
        "Invalid webhook payload",
      );
      res.status(400).json({
        message: "Invalid payload",
        errors: validation.error.format(),
      });
      return;
    }

    const event = validation.data;
    const topic = event.topic;
    const resourceUrl = event._links.resource.href;
    const resourceId = resourceUrl.split("/").pop();
    const eventId = event.id;

    if (!resourceId) {
      logger.warn({ resourceUrl }, "Could not extract resource ID from URL");
      res.status(400).json({ message: "Invalid resource URL" });
      return;
    }

    // Idempotency Check
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      logger.info({ eventId }, "Webhook event already processed");
      res.status(200).send();
      return;
    }

    // Create to reserve the ID. If this fails (race condition), it returns 500.
    await prisma.webhookEvent.create({
      data: {
        eventId,
        provider: "dwolla",
        eventType: topic,
        payload: req.body as any, // Store raw payload
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
  status: "SUCCESS" | "FAILED" | "RETURNED",
): Promise<void> => {
  try {
    // Find all transactions matching either the exact ID or the _CREDIT suffix variant
    // P2P transfers create two transactions: sender (exact ID) and recipient (ID_CREDIT)
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { dwollaTransferId: transferId },
          { dwollaTransferId: `${transferId}_CREDIT` },
        ],
      },
    });

    if (transactions.length === 0) {
      logger.warn({ transferId }, "No transactions found for Dwolla transfer");
      return;
    }

    // Update all matching transactions atomically
    const updateResult = await prisma.transaction.updateMany({
      where: {
        OR: [
          { dwollaTransferId: transferId },
          { dwollaTransferId: `${transferId}_CREDIT` },
        ],
      },
      data: {
        status,
        pending: false, // Transfer completed
      },
    });

    logger.info(
      { transferId, status, updatedCount: updateResult.count },
      "Updated transaction status(es)",
    );
  } catch (error) {
    logger.error({ err: error, transferId }, "Failed to update transaction");
  }
};
