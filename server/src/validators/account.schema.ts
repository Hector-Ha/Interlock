import { z } from "zod";

export const getAccountsParamsSchema = z.object({
  bankId: z.string().uuid("Invalid bank ID format"),
});
