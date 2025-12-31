import { z } from "zod";

export const getTransactionsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  category: z.string().optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "RETURNED"]).optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
});

export const syncTransactionsParamsSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
