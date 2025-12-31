import { z } from "zod";

export const bankIdParamsSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
});

export const linkBankSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
  accountId: z.string().min(1, "Account ID is required"),
});

export const transferSchema = z.object({
  sourceBankId: z.string().uuid("Invalid source bank ID format"),
  destinationBankId: z.string().uuid("Invalid destination bank ID format"),
  amount: z.number().positive("Amount must be positive"),
});
