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
  // WIP: Just logging for now
  console.log("Exchange token hit", req.body);
  res.json({ status: "wip" });
};
