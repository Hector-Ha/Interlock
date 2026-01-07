import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/types/auth.types";
import { bankService } from "@/services/bank.service";
import { prisma } from "@/db";
import {
  bankIdParamsSchema,
  linkBankSchema,
  transferSchema,
} from "@/validators/bank.schema";
import { logger } from "@/middleware/logger";

export const linkBankWithDwolla = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId, accountId } = linkBankSchema.parse(req.body);

    const result = await bankService.linkBankWithDwolla(
      userId,
      bankId,
      accountId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }
    if (error instanceof Error && error.message === "User or bank not found") {
      res.status(404).json({
        message: error.message,
        code: "NOT_FOUND",
      });
      return;
    }
    logger.error({ err: error }, "Link Bank Error");
    res.status(500).json({
      message: "Failed to link bank with Dwolla",
      code: "LINK_BANK_ERROR",
    });
  }
};

export const getBanks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const banks = await bankService.getBanks(userId);

    res.json({ banks });
  } catch (error) {
    logger.error({ err: error }, "Get Banks Error");
    res.status(500).json({
      message: "Failed to get banks",
      code: "GET_BANKS_ERROR",
    });
  }
};

// Retrieves a single bank with details and Dwolla linkage status.
export const getBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId } = bankIdParamsSchema.parse(req.params);

    const bank = await bankService.getBankById(bankId, userId);

    if (!bank) {
      res.status(404).json({
        message: "Bank not found",
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    res.json({ bank });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Get Bank Error");
    res.status(500).json({
      message: "Failed to get bank details",
      code: "GET_BANK_ERROR",
    });
  }
};

// Disconnects a bank and removes all associated data from Plaid, Dwolla, and database.
export const disconnectBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId } = bankIdParamsSchema.parse(req.params);

    await bankService.disconnectBank(bankId, userId);

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        action: "BANK_DISCONNECT",
        resource: "Bank",
        details: { bankId },
        ipAddress: req.ip,
      },
    });

    res.json({
      message: "Bank disconnected successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    if (error instanceof Error && error.message === "Bank not found") {
      res.status(404).json({
        message: error.message,
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    logger.error({ err: error }, "Disconnect Bank Error");
    res.status(500).json({
      message: "Failed to disconnect bank",
      code: "DISCONNECT_BANK_ERROR",
    });
  }
};

export const initiateTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { sourceBankId, destinationBankId, amount } = transferSchema.parse(
      req.body
    );

    const result = await bankService.initiateTransfer(
      userId,
      sourceBankId,
      destinationBankId,
      amount
    );

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }
    if (error instanceof Error) {
      if (error.message === "Source or destination bank not found") {
        res.status(404).json({
          message: error.message,
          code: "NOT_FOUND",
        });
        return;
      }
      if (
        error.message ===
        "Both banks must be linked with Dwolla before initiating transfer"
      ) {
        res.status(400).json({
          message: error.message,
          code: "DWOLLA_NOT_LINKED",
        });
        return;
      }
      if (error.message.startsWith("Insufficient funds")) {
        res.status(400).json({
          message: error.message,
          code: "INSUFFICIENT_FUNDS",
        });
        return;
      }
    }
    logger.error({ err: error }, "Transfer Error");
    res.status(500).json({
      message: "Failed to initiate transfer",
      code: "TRANSFER_ERROR",
    });
  }
};
