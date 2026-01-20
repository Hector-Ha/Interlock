import { config } from "@/config";
import rateLimit from "express-rate-limit";

// Rate limiter for authentication endpoints.
// Only counts failed requests to prevent blocking legitimate users.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req, _res) => {
    if (config.env === "test" || config.env === "development") {
      // Allow forcing strict limit for testing rate limiter itself
      if (req.headers["x-test-force-limit"] === "true") {
        return 5;
      }
      return 1000;
    }
    return 5;
  },
  message: {
    message:
      "Too many authentication attempts. Please try again in 15 minutes.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
});

// General API rate limiter.
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
