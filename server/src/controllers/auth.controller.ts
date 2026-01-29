import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { prisma } from "@/db";
import { authService } from "@/services/auth.service";
import {
  authSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/validators/auth.schema";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/validators/user.schema";
import { logger } from "@/middleware/logger";
import type { AuthRequest } from "@/types/auth.types";

export const signUp = async (req: Request, res: Response) => {
  try {
    const data = authSchema.parse(req.body);

    const { user, token } = await authService.signUp(data);

    // Create session with refresh token
    const refreshToken = await authService.createSession(
      user.id,
      req.get("User-Agent"),
      req.ip,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes to match token expiry
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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

    // Create session with refresh token
    const refreshToken = await authService.createSession(
      user.id,
      req.get("User-Agent"),
      req.ip,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes to match token expiry
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
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
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
  res.json({ message: "Signed out successfully" });
};

// Exchanges refresh token for new access token and rotated refresh token.
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    if (!refreshTokenFromCookie) {
      res.status(401).json({
        message: "No refresh token provided",
        code: "NO_REFRESH_TOKEN",
      });
      return;
    }

    const newRefreshToken = await authService.rotateRefreshToken(
      refreshTokenFromCookie,
      req.get("User-Agent"),
      req.ip,
    );

    if (!newRefreshToken) {
      res.clearCookie("refreshToken", { path: "/api/v1/auth" });
      res.status(401).json({
        message: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
      return;
    }

    // Get user for JWT
    const session = await authService.validateRefreshToken(newRefreshToken);

    if (!session) {
      res.clearCookie("refreshToken", { path: "/api/v1/auth" });
      res.status(401).json({
        message: "Session not found",
        code: "SESSION_NOT_FOUND",
      });
      return;
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      config.jwtSecret,
      { expiresIn: "15m" }, // Short-lived access token
    );

    // Set new access token cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set rotated refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "Token refreshed successfully",
      expiresIn: 900,
    });
  } catch (error) {
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
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });

    res.json({
      message: "All sessions invalidated",
      sessionsInvalidated: count,
    });

    // Non-blocking audit log - don't delay response
    prisma.auditLog
      .create({
        data: {
          userId,
          action: "LOGOUT_ALL",
          resource: "Session",
          details: { sessionsInvalidated: count },
          ipAddress: req.ip,
        },
      })
      .catch((err) =>
        logger.error({ err, userId }, "Failed to create audit log"),
      );
  } catch (error) {
    logger.error({ err: error }, "Logout All Error");
    res.status(500).json({
      message: "Failed to logout all sessions",
      code: "LOGOUT_ALL_ERROR",
    });
  }
};

// Changes user password and invalidates all sessions.
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body,
    );

    await authService.changePassword(userId, currentPassword, newPassword);

    // Clear current session cookies (all sessions are invalidated by service)
    res.clearCookie("token");
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });

    res.json({
      message: "Password changed successfully. Please sign in again.",
    });

    // Non-blocking audit log - don't delay response
    prisma.auditLog
      .create({
        data: {
          userId,
          action: "PASSWORD_CHANGE",
          resource: "User",
          ipAddress: req.ip,
        },
      })
      .catch((err) =>
        logger.error({ err, userId }, "Failed to create audit log"),
      );
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
        code: "INVALID_CURRENT_PASSWORD",
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

// Updates user profile information
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(email);
    res.json({
      message: "If an account exists, a password reset email has been sent.",
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
    logger.error({ err: error }, "Forgot Password Error");
    res.status(500).json({
      message: "Failed to process request",
      code: "FORGOT_PASSWORD_ERROR",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    await authService.resetPasswordWithToken(token, newPassword);
    res.json({ message: "Password has been reset successfully." });
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
      error.message.includes("Invalid or expired")
    ) {
      res.status(400).json({ message: error.message, code: "INVALID_TOKEN" });
      return;
    }
    logger.error({ err: error }, "Reset Password Error");
    res.status(500).json({
      message: "Failed to reset password",
      code: "RESET_PASSWORD_ERROR",
    });
  }
};

export const sendVerification = async (req: AuthRequest, res: Response) => {
  try {
    await authService.sendVerification(req.user.userId);
    res.json({ message: "Verification email sent." });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Please wait")) {
      res.status(429).json({
        message: error.message,
        code: "RATE_LIMITED",
      });
      return;
    }
    logger.error({ err: error }, "Send Verification Error");
    res.status(500).json({
      message: "Failed to send verification email",
      code: "SEND_VERIFICATION_ERROR",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(token);
    res.json({ message: "Email verified successfully." });
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
      error.message.includes("Invalid or expired")
    ) {
      res.status(400).json({ message: error.message, code: "INVALID_TOKEN" });
      return;
    }
    logger.error({ err: error }, "Verify Email Error");
    res.status(500).json({
      message: "Failed to verify email",
      code: "VERIFY_EMAIL_ERROR",
    });
  }
};
