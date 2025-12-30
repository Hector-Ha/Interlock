import { z } from "zod";

export const exchangeTokenSchema = z.object({
  publicToken: z.string().min(1),
  metadata: z.object({
    institution: z.object({
      institution_id: z.string(),
      name: z.string(),
    }),
    accounts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        mask: z.string(),
        type: z.string(),
        subtype: z.string(),
      })
    ),
  }),
});
