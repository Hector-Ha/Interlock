import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/config";
import { httpLogger, logger } from "@/middleware/logger";
import { authLimiter, apiLimiter } from "@/middleware/rateLimit";

import authRoutes from "./routes/auth.routes";
import plaidRoutes from "./routes/plaid.routes";
import bankRoutes from "./routes/bank.routes";
import webhooksRoutes from "./routes/webhooks.routes";
import transactionRoutes from "./routes/transaction.routes";

interface RequestWithRawBody extends express.Request {
  rawBody?: Buffer;
}

const app: express.Application = express();

// Security middleware
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(helmet());

// Request logging
app.use(httpLogger);

// Body parsing
app.use(
  express.json({
    verify: (req: RequestWithRawBody, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes with rate limiting
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/plaid", apiLimiter, plaidRoutes);
app.use("/api/v1/bank", apiLimiter, bankRoutes);
app.use("/api/v1/transaction", apiLimiter, transactionRoutes);
app.use("/api/v1/webhooks", webhooksRoutes);

// Sentry error handling
Sentry.setupExpressErrorHandler(app);

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
    res.status(500).json({
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
    });
  }
);

export default app;
