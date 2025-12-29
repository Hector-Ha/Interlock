import rateLimit from "express-rate-limit";

// Auth API rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});
