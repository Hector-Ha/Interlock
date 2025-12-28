import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { encrypt } from "@/utils/encryption";
import { config } from "@/config";

import { prisma } from "@/db";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  state: z.string().length(2),
  postalCode: z.string().min(5),
  dateOfBirth: z.string(),
  ssn: z.string().length(4),
  country: z.string().optional(),
});

export const signUp = async (req: Request, res: Response) => {
  try {
    const data = authSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const addressString = JSON.stringify({
      address1: data.address,
      state: data.state,
      postalCode: data.postalCode,
      city: "US",
    });

    const encryptedAddress = encrypt(addressString);
    const encryptedDob = encrypt(data.dateOfBirth);
    const encryptedSsn = encrypt(data.ssn);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        address: encryptedAddress,
        dateOfBirth: encryptedDob,
        identityDocumentId: encryptedSsn,
        country: data.country || "US",
      },
    });

    const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.format() });
      return;
    }
    console.error(error);
    res.status(400).json({ message: "Error creating user" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Sign In Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signOut = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully" });
};
