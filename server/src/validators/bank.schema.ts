import { z } from "zod";

export const linkBankSchema = z.object({
  bankId: z.string().uuid(),
  accountId: z.string(),
});

export const transferSchema = z.object({
  sourceBankId: z.string().uuid(),
  destinationBankId: z.string().uuid(),
  amount: z.number().positive(),
});
