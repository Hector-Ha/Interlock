import { z } from "zod";

export const dwollaWebhookSchema = z.object({
  id: z.string(),
  topic: z.string(),
  timestamp: z.string(),
  _links: z.object({
    resource: z.object({
      href: z.string().url(),
    }),
    self: z
      .object({
        href: z.string().url(),
      })
      .optional(),
  }),
});

export type DwollaWebhookPayload = z.infer<typeof dwollaWebhookSchema>;
