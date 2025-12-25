import { Request, Response } from "express";
import { prisma } from "../db";

export const signUp = async (req: Request, res: Response) => {
  // TODO: Implement signup logic
  res.status(501).json({ message: "Not implemented" });
};

export const signIn = async (req: Request, res: Response) => {
  // TODO: Implement signin logic
  res.status(501).json({ message: "Not implemented" });
};
