import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
import { z } from "zod";
import { config } from "@/config";
import { authService } from "@/services/auth.service";
import { authSchema } from "@/validators/auth.schema";

export const signUp = async (req: Request, res: Response) => {
  try {
    const data = authSchema.parse(req.body);

    const { user, token } = await authService.signUp(data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.format() });
      return;
    }
    if (error.message === "User already exists") {
      res.status(409).json({ message: "User already exists" });
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
    const { user, token } = await authService.signIn(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ user: { id: user.id, email: user.email } });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    console.error("Sign In Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.userId);

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
