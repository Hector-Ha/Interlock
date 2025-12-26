import { Request, Response } from "express";
import { prisma } from "../db";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        // Default placeholders for now
        address: "{}",
        identityDocumentId: "",
        dateOfBirth: "",
        country: "US",
      },
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("SignIn Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
