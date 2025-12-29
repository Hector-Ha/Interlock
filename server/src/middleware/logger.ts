import pino from "pino";
import pinoHttp from "pino-http";
import crypto from "node:crypto";
import { config } from "@/config";

/**
 * Base logger instance.
 * Use this for logging outside of request context.
 */
export const logger = pino({
  level: config.env === "production" ? "info" : "debug",
  transport:
    config.env === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

/**
 * HTTP request logger middleware.
 * Logs all incoming requests with timing and status.
 */
export const httpLogger = pinoHttp({
  logger,
  autoLogging: true,
  genReqId: () => crypto.randomUUID(),
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
  },
  // Redact sensitive headers and body fields
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "req.body.password",
      "req.body.currentPassword",
      "req.body.newPassword",
      "req.body.ssn",
    ],
    censor: "[REDACTED]",
  },
});
