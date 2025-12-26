import { Request, Response } from "express";
import { CountryCode, Products } from "plaid";
import { plaidClient } from "../services/plaid.service";
import { prisma } from "../db";
import { encrypt } from "../utils/encryption";

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const user = req.user; // From auth middleware

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.userId.toString(),
      },
      client_name: "Interlock",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    console.log("Link Token Response:", response.data); // Debugging response
    res.json(response.data);
  } catch (error) {
    console.error("Link Token Error:", error);
    res.status(500).json({ error: "Failed to create link token" });
  }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
  try {
    const { publicToken, institutionId, institutionName, user } = req.body;

    console.log("Starting token exchange for user:", user.id);
    console.log("Request body:", req.body);

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    console.log("Plaid Exchange Response:", response.data);

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const encryptedAccessToken = encrypt(accessToken);

    // Persist to DB securely
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
      },
      create: {
        userId: user.userId,
        institutionId: institutionId || "ins_unknown",
        institutionName: institutionName || "Unknown Bank",
        accessToken: encryptedAccessToken,
        itemId: itemId,
        type: "checking",
        mask: "0000",
      },
    });

    res.json({ status: "success", itemId });
  } catch (error) {
    console.error("Exchange Token Error:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};
