import { Request, Response } from "express";
import { z } from "zod";
import { config } from "@/config";
import { authService } from "@/services/auth.service";
import { authSchema, signInSchema } from "@/validators/auth.schema";
import type { AuthRequest } from "@/types/auth.types";

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }
    if (error instanceof Error && error.message === "User already exists") {
      res.status(409).json({
        message: "User already exists",
        code: "USER_EXISTS",
      });
      return;
    }
    console.error("Sign Up Error:", error);
    res.status(500).json({
      message: "Error creating user",
      code: "SIGNUP_ERROR",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const { user, token } = await authService.signIn(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        res.status(401).json({
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
        return;
      }
      if (error.message.includes("Account is locked")) {
        res.status(423).json({
          message: error.message,
          code: "ACCOUNT_LOCKED",
        });
        return;
      }
      if (error.message.includes("Too many failed attempts")) {
        res.status(423).json({
          message: error.message,
          code: "ACCOUNT_LOCKED",
        });
        return;
      }
    }
    console.error("Sign In Error:", error);
    res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
};

export const signOut = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully" });
};
