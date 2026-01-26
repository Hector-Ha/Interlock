import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/types/auth.types";
import { prisma } from "@/db";
import { transferService } from "@/services/transfer.service";
import {
  getTransfersQuerySchema,
  transferIdSchema,
} from "@/validators/transfer.schema";
import { logger } from "@/middleware/logger";

// Gets a single transfer by ID.

export const getTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { transferId } = transferIdSchema.parse(req.params);

    const transfer = await transferService.getTransferById(transferId, userId);

    if (!transfer) {
      res.status(404).json({
        message: "Transfer not found",
        code: "TRANSFER_NOT_FOUND",
      });
      return;
    }

    res.json({ transfer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Get Transfer Error");
    res.status(500).json({
      message: "Failed to get transfer",
      code: "GET_TRANSFER_ERROR",
    });
  }
};

// Lists user's transfers with pagination and filtering.
export const getTransfers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const query = getTransfersQuerySchema.parse(req.query);

    const result = await transferService.getTransfers(
      userId,
      {
        status: query.status,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        search: query.search,
        sortBy: query.sortBy,
      },
      {
        limit: query.limit,
        offset: query.offset,
      },
    );

    res.json({
      transfers: result.data,
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

    logger.error({ err: error }, "Get Transfers Error");
    res.status(500).json({
      message: "Failed to get transfers",
      code: "GET_TRANSFERS_ERROR",
    });
  }
};

// Cancels a pending transfer.
export const cancelTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { transferId } = transferIdSchema.parse(req.params);

    await transferService.cancelTransfer(transferId, userId);

    res.json({ message: "Transfer cancelled successfully" });

    // Non-blocking audit log - don't delay response
    prisma.auditLog
      .create({
        data: {
          userId,
          action: "TRANSFER_CANCEL",
          resource: "Transaction",
          details: { transferId },
          ipAddress: req.ip,
        },
      })
      .catch((err) =>
        logger.error({ err, userId, transferId }, "Failed to create audit log"),
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

    if (error instanceof Error) {
      if (error.message === "Transfer not found") {
        res.status(404).json({
          message: error.message,
          code: "TRANSFER_NOT_FOUND",
        });
        return;
      }
      if (error.message === "Only pending transfers can be cancelled") {
        res.status(400).json({
          message: error.message,
          code: "TRANSFER_NOT_PENDING",
        });
        return;
      }
      if (error.message === "Transfer has no Dwolla ID") {
        res.status(400).json({
          message: error.message,
          code: "TRANSFER_INVALID",
        });
        return;
      }
      if (error.message === "Failed to cancel transfer with payment provider") {
        res.status(502).json({
          message: error.message,
          code: "PAYMENT_PROVIDER_ERROR",
        });
        return;
      }
    }

    logger.error({ err: error }, "Cancel Transfer Error");
    res.status(500).json({
      message: "Failed to cancel transfer",
      code: "CANCEL_TRANSFER_ERROR",
    });
  }
};
