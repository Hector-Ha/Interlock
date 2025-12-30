import { z } from "zod";

export const getAccountsParamsSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
});

export const getAccountBalanceParamsSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
  accountId: z.string().min(1, "Account ID is required"),
});