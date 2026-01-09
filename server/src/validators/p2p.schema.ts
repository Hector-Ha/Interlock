import { z } from "zod";

// Requires minimum 3 characters for security and performance.
export const recipientSearchSchema = z.object({
  q: z.string().min(3, "Search query must be at least 3 characters"),
});

// Enforces $2,000 per-transaction limit at validation level.
export const p2pTransferSchema = z.object({
  recipientId: z.string().uuid("Invalid recipient ID"),
  senderBankId: z.string().uuid("Invalid bank ID"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(2000, "Maximum transfer amount is $2,000"),
  note: z.string().max(200, "Note must be 200 characters or less").optional(),
});

export type RecipientSearchInput = z.infer<typeof recipientSearchSchema>;
export type P2PTransferInput = z.infer<typeof p2pTransferSchema>;
