import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { logger } from "@/middleware/logger";
import type { JwtPayload, AuthRequest } from "@/types/auth.types";

// Re-export for convenience
export type { AuthRequest, JwtPayload } from "@/types/auth.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Authentication required",
      code: "AUTH_REQUIRED",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    logger.warn({ err: error, ip: req.ip }, "Failed JWT verification");
    res.status(401).json({
      message: "Invalid or expired token",
      code: "INVALID_TOKEN",
    });
  }
};
