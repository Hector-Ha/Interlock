import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/types/auth.types";
import { prisma } from "@/db";
import * as transactionService from "@/services/transaction.service";
import {
  getTransactionsQuerySchema,
  syncTransactionsParamsSchema,
} from "@/validators/transaction.schema";
import { logger } from "@/middleware/logger";

// Lists transactions with filtering and pagination.
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId } = syncTransactionsParamsSchema.parse(req.params);
    const query = getTransactionsQuerySchema.parse(req.query);

    // Verify bank ownership
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
    });

    if (!bank) {
      res.status(404).json({
        message: "Bank not found",
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    const result = await transactionService.getTransactions(
      bankId,
      {
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        category: query.category,
        status: query.status,
        minAmount: query.minAmount,
        maxAmount: query.maxAmount,
      },
      {
        limit: query.limit,
        offset: query.offset,
      },
    );

    res.json({
      transactions: result.data,
      pagination: result.pagination,
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

    logger.error({ err: error }, "Get Transactions Error");
    res.status(500).json({
      message: "Failed to retrieve transactions",
      code: "GET_TRANSACTIONS_ERROR",
    });
  }
};

// Gets a single transaction by ID.
export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { transactionId } = req.params;

    const transaction = await transactionService.getTransactionById(
      transactionId,
      userId,
    );

    if (!transaction) {
      res.status(404).json({
        message: "Transaction not found",
        code: "TRANSACTION_NOT_FOUND",
      });
      return;
    }

    res.json({ transaction });
  } catch (error) {
    logger.error({ err: error }, "Get Transaction Error");
    res.status(500).json({
      message: "Failed to retrieve transaction",
      code: "GET_TRANSACTION_ERROR",
    });
  }
};

// Triggers a transaction sync from Plaid.
export const syncTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId } = syncTransactionsParamsSchema.parse(req.params);

    // Verify bank ownership
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
    });

    if (!bank) {
      res.status(404).json({
        message: "Bank not found",
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    const result = await transactionService.syncTransactions(bankId);

    res.json({
      message: "Transactions synced successfully",
      result,
    });

    // Non-blocking audit log - don't delay response
    prisma.auditLog
      .create({
        data: {
          userId,
          action: "TRANSACTION_SYNC",
          resource: "Bank",
          details: { bankId, ...result },
          ipAddress: req.ip,
        },
      })
      .catch((err) =>
        logger.error({ err, userId, bankId }, "Failed to create audit log"),
      );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Sync Transactions Error");
    res.status(500).json({
      message: "Failed to sync transactions",
      code: "SYNC_ERROR",
    });
  }
};
