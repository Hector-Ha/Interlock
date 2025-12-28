import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
import { z } from "zod";
import { createLinkToken, exchangePublicToken } from "@/services/plaid.service";

const exchangeTokenSchema = z.object({
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

export const createLinkTokenHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const linkToken = await createLinkToken(userId);

    res.json({ link_token: linkToken });
  } catch (error) {
    console.error("Plaid Link Token Error:", error);
    res.status(500).json({ message: "Failed to create link token" });
  }
};

export const exchangeTokenHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const { publicToken, metadata } = exchangeTokenSchema.parse(req.body);

    const bank = await exchangePublicToken(userId, publicToken, metadata);

    res.status(201).json({ bank });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.format(),
      });
      return;
    }

    console.error("Plaid Exchange Token Error:", error);
    res.status(500).json({ message: "Failed to exchange token" });
  }
};
