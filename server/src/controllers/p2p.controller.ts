import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/middleware/auth";
import { logger } from "@/middleware/logger";
import { p2pService } from "@/services/p2p.service";
import {
  recipientSearchSchema,
  p2pTransferSchema,
} from "@/validators/p2p.schema";

// Search for P2P transfer recipients by email or phone.
export const searchRecipients = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = recipientSearchSchema.parse(req.query);
    const recipients = await p2pService.searchRecipients(q, req.user.userId);

    res.json({ recipients });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: error.issues[0].message,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    logger.error({ err: error }, "Search Recipients Error");
    res.status(500).json({
      message: "Failed to search recipients",
      code: "SEARCH_ERROR",
    });
  }
};

// Create a P2P transfer to another user.
export const createP2PTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const data = p2pTransferSchema.parse(req.body);

    const result = await p2pService.createTransfer({
      senderId: req.user.userId,
      recipientId: data.recipientId,
      senderBankId: data.senderBankId,
      amount: data.amount,
      note: data.note,
    });

    res.status(201).json({
      message: "Transfer initiated successfully",
      transactionId: result.senderTransaction.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: error.issues[0].message,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    if (error instanceof Error) {
      // Business rule violations (limits, missing bank, etc.)
      res.status(400).json({
        message: error.message,
        code: "TRANSFER_ERROR",
      });
      return;
    }

    logger.error({ err: error }, "Create P2P Transfer Error");
    res.status(500).json({
      message: "Failed to create transfer",
      code: "TRANSFER_ERROR",
    });
  }
};
