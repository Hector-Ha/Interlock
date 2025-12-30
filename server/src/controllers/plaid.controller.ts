import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/types/auth.types";
import { createLinkToken, exchangePublicToken } from "@/services/plaid.service";
import { exchangeTokenSchema } from "@/validators/plaid.schema";
import { logger } from "@/middleware/logger";

export const createLinkTokenHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.userId;
    const linkToken = await createLinkToken(userId);

    res.json({ link_token: linkToken });
  } catch (error) {
    logger.error({ err: error }, "Plaid Link Token Error");
    res.status(500).json({
      message: "Failed to create link token",
      code: "LINK_TOKEN_ERROR",
    });
  }
};

export const exchangeTokenHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { publicToken, metadata } = exchangeTokenSchema.parse(req.body);

    const bank = await exchangePublicToken(userId, publicToken, metadata);

    res.status(201).json({ bank });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Plaid Exchange Token Error");
    res.status(500).json({
      message: "Failed to exchange token",
      code: "EXCHANGE_TOKEN_ERROR",
    });
  }
};
