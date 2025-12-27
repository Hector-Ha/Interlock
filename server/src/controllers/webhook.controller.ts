import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "../config";
import { verifyWebhookSignature } from "../utils/webhook-signature";

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-request-signature-sha-256"];

  if (!signature) {
    res.status(400).send("Missing signature");
    return;
  }

  if (
    !verifyWebhookSignature(
      signature as string,
      req.body,
      config.dwolla.webhookSecret!
    )
  ) {
    console.warn("Invalid webhook signature attempted");
    res.status(403).send("Invalid signature");
    return;
  }

  const event = req.body;
  console.log("Verified Webhook:", event.topic, event.resourceId);

  // Process event (mock processing)
  if (event.topic === "customer_transfer_completed") {
    console.log("Transfer completed:", event.resourceId);
    // Logic to update DB would go here
  }

  res.status(200).send("OK");
};
