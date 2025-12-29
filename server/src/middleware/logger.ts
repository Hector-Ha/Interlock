import pino from "pino";
import pinoHttp from "pino-http";
import { config } from "@/config";

export const logger = pino({
  level: config.env === "development" ? "debug" : "info",
  transport:
    config.env === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

// HTTP Request Logger Middleware
export const httpLogger = pinoHttp({
  logger,

  serializers: {
    req(req) {
      req.body = req.raw.body;
      return req;
    },
  },
  // Redact sensitive headers and body fields
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.currentPassword",
      "req.body.newPassword",
      "req.body.ssn",
      "req.body.dateOfBirth",
      "req.body.firstName", // PII
      "req.body.lastName", // PII
      "req.body.address", // PII
      "req.body.token",
      "req.body.secret",
      "req.body.access_token",
      "req.body.public_token",
    ],
    remove: true,
  },
});
