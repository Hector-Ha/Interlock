import { z } from "zod";

export const getTransfersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "RETURNED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const transferIdSchema = z.object({
  transferId: z.string().uuid("Invalid transfer ID format"),
});
