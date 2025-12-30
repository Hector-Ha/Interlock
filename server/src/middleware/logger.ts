import pino from "pino";
import pinoHttp from "pino-http";
import crypto from "node:crypto";
import { config } from "@/config";

// Sensitive fields that should be redacted from logs.
const redactConfig = {
  paths: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "req.body.password",
    "req.body.currentPassword",
    "req.body.newPassword",
    "req.body.ssn",
    "password",
    "ssn",
    "accessToken",
    "refreshToken",
  ],
  censor: "[REDACTED]",
};

// Base logger instance.
export const logger = pino({
  level: config.env === "production" ? "info" : "debug",
  redact: redactConfig,
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

// HTTP request logger middleware.
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
});
