import { Request, Response } from "express";
import { CountryCode, Products } from "plaid";
import { plaidClient } from "../services/plaid.service";
import { prisma } from "../db";
import { encrypt } from "../utils/encryption";
import { CreateLinkTokenRequest, ExchangeTokenRequest } from "../types/plaid";

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const user = req.user; // From auth middleware, assume valid

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.userId.toString(),
      },
      client_name: "Interlock",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    res.json(response.data);
  } catch (error) {
    console.error("Link Token Error:", error);
    res.status(500).json({ error: "Failed to create link token" });
  }
};

export const exchangePublicToken = async (
  req: Request<{}, {}, ExchangeTokenRequest>,
  res: Response
) => {
  try {
    const { publicToken, institutionId, institutionName } = req.body;
    const user = req.user; // Middleware populated

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const encryptedAccessToken = encrypt(accessToken);

    // Persist to DB securely
    // Note: ensure generated client supports userId_institutionId compound unique
    await prisma.bank.upsert({
      where: {
        userId_institutionId: {
          userId: user.userId,
          institutionId: institutionId || "ins_unknown",
        },
      },
      update: {
        accessToken: encryptedAccessToken,
        itemId: itemId,
        institutionName: institutionName || "Unknown Bank", // Update name if provided
      },
      create: {
        userId: user.userId,
        institutionId: institutionId || "ins_unknown",
        institutionName: institutionName || "Unknown Bank",
        accessToken: encryptedAccessToken,
        itemId: itemId,
        type: "checking", // Default, could be derived from accounts
        mask: "0000", // Default, should fetch accounts meta
      },
    });

    res.json({ status: "success", itemId });
  } catch (error) {
    console.error("Exchange Token Error:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};
