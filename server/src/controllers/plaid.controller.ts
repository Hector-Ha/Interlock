import { Request, Response } from "express";
import { CountryCode, Products } from "plaid";
import { plaidClient } from "../services/plaid.service";
import { prisma } from "../db";

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

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Save to DB (Security Risk: Storing raw access token)
    await prisma.bank.create({
      data: {
        userId: user.id, // Assuming passed from frontend or auth
        institutionId: institutionId || "ins_unknown",
        institutionName: institutionName || "Unknown Bank",
        accessToken: accessToken, // Not encrypted! based on plan
        itemId: itemId,
        type: "checking", // Defaulting for now
        mask: "0000", // Placeholder
      },
    });

    res.json({ status: "success", itemId });
  } catch (error) {
    console.error("Exchange Token Error:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};
