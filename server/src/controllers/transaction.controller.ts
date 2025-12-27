import { Request, Response } from "express";
import { plaidClient } from "../services/plaid.service";
import { prisma } from "../db";
import { decrypt } from "../utils/encryption";

export const syncTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { itemId } = req.body;

    // fetch item to get access token
    const bank = await prisma.bank.findFirst({
      where: { itemId },
    });

    if (!bank) {
      res.status(404).json({ error: "Bank not found" });
      return;
    }

    const accessToken = decrypt(bank.accessToken);

    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
    });

    const added = response.data.added;

    for (const transaction of added) {
      await prisma.transaction.create({
        data: {
          id: transaction.transaction_id,
          name: transaction.name,
          amount: transaction.amount,
          date: transaction.date,
          paymentChannel: transaction.payment_channel,
          type: transaction.transaction_type,
          accountId: transaction.account_id,
          bankId: bank.id,
          userId: user.userId,
        },
      });
    }

    res.json({ status: "synced", count: added.length });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: "Failed to sync transactions" });
  }
};
