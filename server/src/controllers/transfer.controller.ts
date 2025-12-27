import { Request, Response } from "express";
import { dwollaClient } from "../services/dwolla.service";
import { prisma } from "../db";

export const createTransfer = async (req: Request, res: Response) => {
  try {
    const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } =
      req.body;
    const user = req.user;

    const requestBody = {
      _links: {
        source: { href: sourceFundingSourceUrl },
        destination: { href: destinationFundingSourceUrl },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };

    const response = await dwollaClient.post("transfers", requestBody);
    const transferUrl = response.headers.get("location");

    // Save initial state to DB
    await prisma.transfer.create({
      data: {
        userId: user.userId,
        dwollaTransferId: transferUrl?.split("/").pop() || "",
        amount: parseFloat(amount),
        status: "pending",
        type: "p2p", // Default for now
        sourceId: sourceFundingSourceUrl,
        destinationId: destinationFundingSourceUrl,
      },
    });

    res.status(201).json({ transferUrl });
  } catch (error) {
    console.error("Transfer Error:", error);
    res.status(500).json({ error: "Failed to create transfer" });
  }
};
