import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "@/config";
import { prisma } from "@/db";
import { logger } from "@/middleware/logger";
import { dwollaWebhookSchema } from "@/validators";
import { notificationService } from "@/services/notification.service";

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
      include: {
        bank: {
          select: { userId: true },
        },
        sender: {
          select: { id: true },
        },
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

    // Create notifications for transfer status changes (non-P2P transfers only)
    // P2P transfers already have their own notification logic in p2p.service.ts
    for (const transaction of transactions) {
      // Skip P2P transactions (they have sender/recipient relations)
      if (transaction.senderId || transaction.recipientId) {
        continue;
      }

      const userId = transaction.bank.userId;
      const amount = Math.abs(Number(transaction.amount)).toFixed(2);

      if (status === "SUCCESS") {
        // Check user preferences before creating notification
        const shouldNotify = await notificationService.shouldNotify(
          userId,
          "TRANSFER_COMPLETED",
          "inApp",
        );

        if (shouldNotify) {
          await notificationService.create({
            recipientUserId: userId,
            type: "TRANSFER_COMPLETED",
            title: "Transfer Complete",
            message: `Your transfer of $${amount} has been completed successfully.`,
            relatedTransactionId: transaction.id,
            actionUrl: `/transactions/${transaction.id}`,
          });
        }
      } else {
        // FAILED or RETURNED
        const shouldNotify = await notificationService.shouldNotify(
          userId,
          "TRANSFER_FAILED",
          "inApp",
        );

        if (shouldNotify) {
          const statusText = status === "RETURNED" ? "returned" : "failed";
          await notificationService.create({
            recipientUserId: userId,
            type: "TRANSFER_FAILED",
            title: "Transfer Failed",
            message: `Your transfer of $${amount} has ${statusText}. Please check the transaction details.`,
            relatedTransactionId: transaction.id,
            actionUrl: `/transactions/${transaction.id}`,
          });
        }
      }
    }
  } catch (error) {
    logger.error({ err: error, transferId }, "Failed to update transaction");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Plaid Webhooks
// ─────────────────────────────────────────────────────────────────────────────

interface PlaidWebhookPayload {
  webhook_type: string;
  webhook_code: string;
  item_id?: string;
  error?: {
    error_code?: string;
    error_message?: string;
    error_type?: string;
  };
}

export const handlePlaidWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body as PlaidWebhookPayload;
    const { webhook_type, webhook_code, item_id, error } = payload;

    logger.info(
      { webhook_type, webhook_code, item_id },
      "Received Plaid webhook",
    );

    // Handle ITEM webhooks for bank disconnection
    if (webhook_type === "ITEM") {
      // ITEM_LOGIN_REQUIRED - User needs to reconnect their bank
      if (
        webhook_code === "ERROR" &&
        error?.error_code === "ITEM_LOGIN_REQUIRED"
      ) {
        if (item_id) {
          await handleBankDisconnection(item_id, "login_required");
        }
      }

      // USER_PERMISSION_REVOKED - User revoked access
      if (webhook_code === "USER_PERMISSION_REVOKED") {
        if (item_id) {
          await handleBankDisconnection(item_id, "permission_revoked");
        }
      }

      // PENDING_EXPIRATION - Connection will expire soon
      if (webhook_code === "PENDING_EXPIRATION") {
        if (item_id) {
          await handleBankDisconnection(item_id, "pending_expiration");
        }
      }
    }

    // Always respond 200 to acknowledge receipt
    res.status(200).send();
  } catch (error) {
    logger.error({ err: error }, "Plaid Webhook Error");
    // Still respond 200 to prevent retries
    res.status(200).send();
  }
};

const handleBankDisconnection = async (
  plaidItemId: string,
  reason: "login_required" | "permission_revoked" | "pending_expiration",
): Promise<void> => {
  try {
    // Find bank by Plaid item ID
    const bank = await prisma.bank.findUnique({
      where: { plaidItemId },
      select: {
        id: true,
        institutionName: true,
        userId: true,
        status: true,
      },
    });

    if (!bank) {
      logger.warn({ plaidItemId }, "No bank found for Plaid item ID");
      return;
    }

    // Update bank status if not already in a bad state
    if (bank.status !== "LOGIN_REQUIRED") {
      await prisma.bank.update({
        where: { id: bank.id },
        data: { status: "LOGIN_REQUIRED" },
      });
    }

    // Check user preferences before creating notification
    const shouldNotify = await notificationService.shouldNotify(
      bank.userId,
      "BANK_DISCONNECTED",
      "inApp",
    );

    if (!shouldNotify) {
      return;
    }

    // Create appropriate notification based on reason
    let title: string;
    let message: string;

    switch (reason) {
      case "login_required":
        title = "Bank Connection Issue";
        message = `Your connection to ${bank.institutionName} requires attention. Please reconnect your account to continue using this bank.`;
        break;
      case "permission_revoked":
        title = "Bank Access Revoked";
        message = `Access to your ${bank.institutionName} account has been revoked. Please reconnect if you'd like to continue using this bank.`;
        break;
      case "pending_expiration":
        title = "Bank Connection Expiring";
        message = `Your connection to ${bank.institutionName} will expire soon. Please reconnect to maintain access.`;
        break;
    }

    await notificationService.create({
      recipientUserId: bank.userId,
      type: "BANK_DISCONNECTED",
      title,
      message,
      actionUrl: `/banks/${bank.id}`,
    });

    logger.info(
      { plaidItemId, bankId: bank.id, reason },
      "Created bank disconnection notification",
    );
  } catch (error) {
    logger.error(
      { err: error, plaidItemId, reason },
      "Failed to handle bank disconnection",
    );
  }
};
