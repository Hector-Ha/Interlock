import { config } from "@/config";
import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication endpoints.
 * Limits to 5 attempts per 15 minutes per IP.
 * Only counts failed requests to prevent blocking legitimate users.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.env === "test" ? 1000 : 5, // 5 attempts per window (1000 for tests)
  message: {
    message:
      "Too many authentication attempts. Please try again in 15 minutes.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * General API rate limiter.
 * Limits to 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: {
    message: "Too many requests. Please slow down.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
