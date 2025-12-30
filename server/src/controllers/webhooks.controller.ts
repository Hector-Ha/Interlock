import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "@/config";
import { prisma } from "@/db";

interface WebhookRequest extends Request {
  rawBody?: Buffer;
}

const verifySignature = (req: WebhookRequest): boolean => {
  const signature = req.headers["x-request-signature-sha-256"];
  const secret = config.dwolla.webhookSecret;

  if (!signature || !secret || !req.rawBody) {
    console.warn(
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

    console.info(`Received Dwolla Webhook: ${topic} for ${resourceId}`);

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
        console.info(`Unhandled topic: ${topic}`);
    }

    res.status(200).send();
  } catch (error) {
    console.error("Webhook Error:", error);
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
      console.warn(`Transaction not found for Dwolla ID: ${transferId}`);
      return;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status },
    });

    console.info(
      `Updated transaction ${transaction.id} (Dwolla ID: ${transferId}) to ${status}`
    );
  } catch (error) {
    console.error(`Failed to update transaction ${transferId}:`, error);
  }
};
