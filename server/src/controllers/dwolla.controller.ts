import { Request, Response } from "express";
import { dwollaClient } from "../services/dwolla.service";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, type } = req.body;

    const requestBody = {
      firstName,
      lastName,
      email,
      type: type || "personal",
    };

    const response = await dwollaClient.post("customers", requestBody);
    res.status(201).json({ customerUrl: response.headers.get("location") });
  } catch (error) {
    console.error("Failed to create Dwolla customer", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
};
