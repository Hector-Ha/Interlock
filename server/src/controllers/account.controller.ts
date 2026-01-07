import { Response } from "express";
import { z } from "zod";
import { prisma } from "@/db";
import { decrypt } from "@/utils/encryption";
import { AuthRequest } from "@/types/auth.types";
import { getEffectiveAccounts } from "@/services/bank.service";
import {
  getAccountsParamsSchema,
  getAccountBalanceParamsSchema,
} from "@/validators/account.schema";
import { logger } from "@/middleware/logger";

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId } = getAccountsParamsSchema.parse(req.params);

    // Validate Bank Ownership
    const bank = await prisma.bank.findFirst({
      where: {
        id: bankId,
        userId: userId,
      },
      select: {
        plaidAccessToken: true,
        institutionName: true,
      },
    });

    if (!bank || !bank.plaidAccessToken) {
      res.status(404).json({
        message: "Bank not found or not connected",
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    // Decrypt Access Token
    const accessToken = decrypt(bank.plaidAccessToken);

    // Fetch Accounts from Plaid (with effective balance adjustment)
    const accounts = await getEffectiveAccounts(bankId, accessToken);

    res.json({
      accounts,
      institutionName: bank.institutionName,
      lastUpdated: new Date(),
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

    logger.error(
      { err: error, bankId: req.params.bankId },
      "Get Accounts Error"
    );
    res.status(500).json({
      message: "Failed to retrieve accounts",
      code: "GET_ACCOUNTS_ERROR",
    });
  }
};

export const getAccountBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { bankId, accountId } = getAccountBalanceParamsSchema.parse(
      req.params
    );

    const bank = await prisma.bank.findFirst({
      where: {
        id: bankId,
        userId: userId,
      },
      select: {
        plaidAccessToken: true,
      },
    });

    if (!bank || !bank.plaidAccessToken) {
      res.status(404).json({
        message: "Bank not found",
        code: "BANK_NOT_FOUND",
      });
      return;
    }

    const accessToken = decrypt(bank.plaidAccessToken);

    // Fetch Accounts and filter for specific account
    const accounts = await getEffectiveAccounts(bankId, accessToken);
    const account = accounts.find((acc) => acc.id === accountId);

    if (!account) {
      res.status(404).json({
        message: "Account not found in this institution",
        code: "ACCOUNT_NOT_FOUND",
      });
      return;
    }

    res.json({
      accountId: account.id,
      balance: account.balance,
      lastUpdated: new Date(),
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

    logger.error(
      { err: error, bankId: req.params.bankId },
      "Get Account Balance Error"
    );
    res.status(500).json({
      message: "Failed to retrieve account balance",
      code: "GET_BALANCE_ERROR",
    });
  }
};
