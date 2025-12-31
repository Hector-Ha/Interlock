import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { prisma } from "@/db";
import { authService } from "@/services/auth.service";
import { authSchema, signInSchema } from "@/validators/auth.schema";
import {
  updateProfileSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from "@/validators/user.schema";
import { logger } from "@/middleware/logger";
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
    logger.error({ err: error }, "Sign Up Error");
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
    logger.error({ err: error }, "Sign In Error");
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
    logger.error({ err: error }, "Get Me Error");
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

// Exchanges refresh token for new access token.
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const newRefreshToken = await authService.rotateRefreshToken(
      refreshToken,
      req.get("User-Agent"),
      req.ip
    );

    if (!newRefreshToken) {
      res.status(401).json({
        message: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
      return;
    }

    // Get user for JWT
    const session = await authService.validateRefreshToken(newRefreshToken);

    if (!session) {
      res.status(401).json({
        message: "Session not found",
        code: "SESSION_NOT_FOUND",
      });
      return;
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      config.jwtSecret,
      { expiresIn: "15m" } // Short-lived access token
    );

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Refresh Token Error");
    res.status(500).json({
      message: "Failed to refresh token",
      code: "REFRESH_TOKEN_ERROR",
    });
  }
};

// Invalidates all user sessions.
export const logoutAll = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const count = await authService.invalidateAllSessions(userId);

    res.clearCookie("token");

    await prisma.auditLog.create({
      data: {
        userId,
        action: "LOGOUT_ALL",
        resource: "Session",
        details: { sessionsInvalidated: count },
        ipAddress: req.ip,
      },
    });

    res.json({
      message: "All sessions invalidated",
      sessionsInvalidated: count,
    });
  } catch (error) {
    logger.error({ err: error }, "Logout All Error");
    res.status(500).json({
      message: "Failed to logout all sessions",
      code: "LOGOUT_ALL_ERROR",
    });
  }
};

// Changes user password.
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    await authService.changePassword(userId, currentPassword, newPassword);

    await prisma.auditLog.create({
      data: {
        userId,
        action: "PASSWORD_CHANGE",
        resource: "User",
        ipAddress: req.ip,
      },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Current password is incorrect"
    ) {
      res.status(401).json({
        message: "Current password is incorrect",
        code: "INVALID_PASSWORD",
      });
      return;
    }

    logger.error({ err: error }, "Change Password Error");
    res.status(500).json({
      message: "Failed to change password",
      code: "CHANGE_PASSWORD_ERROR",
    });
  }
};

// Updates user profile.
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const data = updateProfileSchema.parse(req.body);

    const user = await authService.updateProfile(userId, data);

    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        errors: error.format(),
      });
      return;
    }

    logger.error({ err: error }, "Update Profile Error");
    res.status(500).json({
      message: "Failed to update profile",
      code: "UPDATE_PROFILE_ERROR",
    });
  }
};
