import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
import { z } from "zod";
import { prisma } from "@/db";
import { decrypt } from "@/utils/encryption";
import { createProcessorToken } from "@/services/plaid.service";
import {
  ensureCustomer,
  addFundingSource,
  createTransfer,
} from "@/services/dwolla.service";

const linkBankSchema = z.object({
  bankId: z.string().uuid(),
  accountId: z.string(),
});

const transferSchema = z.object({
  sourceBankId: z.string().uuid(),
  destinationBankId: z.string().uuid(),
  amount: z.number().positive(),
});

export const linkBankWithDwolla = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { bankId, accountId } = linkBankSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const bank = await prisma.bank.findFirst({
      where: { id: bankId, userId },
    });

    if (!user || !bank) {
      res.status(404).json({ message: "User or bank not found" });
      return;
    }

    if (bank.dwollaFundingUrl) {
      res.json({
        message: "Bank already linked with Dwolla",
        fundingSourceUrl: bank.dwollaFundingUrl,
      });
      return;
    }

    const { customerUrl } = await ensureCustomer(user);

    const accessToken = decrypt(bank.plaidAccessToken);
    const processorToken = await createProcessorToken(accessToken, accountId);

    const fundingSourceUrl = await addFundingSource(
      customerUrl,
      processorToken,
      bank.institutionName
    );

    await prisma.bank.update({
      where: { id: bankId },
      data: { dwollaFundingUrl: fundingSourceUrl },
    });

    res.json({
      message: "Bank linked with Dwolla successfully",
      fundingSourceUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
      return;
    }
    console.error("Link Bank Error:", error);
    res.status(500).json({ message: "Failed to link bank with Dwolla" });
  }
};

export const getBanks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const banks = await prisma.bank.findMany({
      where: { userId },
      select: {
        id: true,
        institutionId: true,
        institutionName: true,
        status: true,
        dwollaFundingUrl: true,
        createdAt: true,
      },
    });

    res.json({ banks });
  } catch (error) {
    console.error("Get Banks Error:", error);
    res.status(500).json({ message: "Failed to get banks" });
  }
};

export const initiateTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { sourceBankId, destinationBankId, amount } = transferSchema.parse(
      req.body
    );

    const sourceBank = await prisma.bank.findFirst({
      where: { id: sourceBankId, userId },
    });
    const destBank = await prisma.bank.findFirst({
      where: { id: destinationBankId, userId },
    });

    if (!sourceBank || !destBank) {
      res.status(404).json({ message: "Source or destination bank not found" });
      return;
    }

    if (!sourceBank.dwollaFundingUrl || !destBank.dwollaFundingUrl) {
      res.status(400).json({
        message:
          "Both banks must be linked with Dwolla before initiating transfer",
      });
      return;
    }

    const { transferUrl, transferId } = await createTransfer(
      sourceBank.dwollaFundingUrl,
      destBank.dwollaFundingUrl,
      amount
    );

    const transaction = await prisma.transaction.create({
      data: {
        bankId: sourceBankId,
        amount,
        name: `Transfer to ${destBank.institutionName}`,
        date: new Date(),
        channel: "ACH",
        status: "PENDING",
        dwollaTransferId: transferId,
      },
    });

    res.status(201).json({
      message: "Transfer initiated",
      transferId,
      transactionId: transaction.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
      return;
    }
    console.error("Transfer Error:", error);
    res.status(500).json({ message: "Failed to initiate transfer" });
  }
};
