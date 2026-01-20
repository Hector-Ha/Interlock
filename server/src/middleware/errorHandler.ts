import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "./logger";

// Application-specific error with status code and error code.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "AppError";
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Centralized error handling middleware.
// Handles ZodError, AppError, and unexpected errors.
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      code: "VALIDATION_ERROR",
      errors: err.format(),
    });
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
    return;
  }

  // Log unexpected errors
  logger.error({ err, url: req.url, method: req.method }, "Unhandled error");

  // Return generic error response
  res.status(500).json({
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
};
