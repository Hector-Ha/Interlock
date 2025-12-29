import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/auth.types";
import { z } from "zod";
import { bankService } from "@/services/bank.service";
import { linkBankSchema, transferSchema } from "@/validators/bank.schema";

export const linkBankWithDwolla = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { bankId, accountId } = linkBankSchema.parse(req.body);

    const result = await bankService.linkBankWithDwolla(
      userId,
      bankId,
      accountId
    );

    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
      return;
    }
    if (error.message === "User or bank not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    console.error("Link Bank Error:", error);
    res.status(500).json({ message: "Failed to link bank with Dwolla" });
  }
};

export const getBanks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const banks = await bankService.getBanks(userId);

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

    const result = await bankService.initiateTransfer(
      userId,
      sourceBankId,
      destinationBankId,
      amount
    );

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
      return;
    }
    if (error.message === "Source or destination bank not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (
      error.message ===
      "Both banks must be linked with Dwolla before initiating transfer"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error("Transfer Error:", error);
    res.status(500).json({ message: "Failed to initiate transfer" });
  }
};
