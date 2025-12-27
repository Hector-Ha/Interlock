import { Request, Response } from "express";

export const handleWebhook = async (req: Request, res: Response) => {
  // Anyone can send a POST request here and spoof events possible for a SECURITY VULNERABILITY.

  const event = req.body;
  console.log("Received Webhook:", event.topic, event.resourceId);

  // Process event (mock processing)
  if (event.topic === "customer_transfer_completed") {
    console.log("Transfer completed:", event.resourceId);
    // Logic to update DB would go here
  }

  res.status(200).send("OK");
};
