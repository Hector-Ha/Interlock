import express from "express";
import * as Sentry from "@sentry/bun";
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
import transferRoutes from "./routes/transfer.routes";
import p2pRoutes from "./routes/p2p.routes";
import notificationRoutes from "./routes/notification.routes";
import healthRoutes from "./routes/health.routes";
import metricsRoutes from "./routes/metrics.routes";
import { metricsMiddleware } from "@/middleware/metrics";

interface RequestWithRawBody extends express.Request {
  rawBody?: Buffer;
}

const app: express.Application = express();

// Security middleware
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Next.js requires unsafe-eval in dev
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", config.clientUrl],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    noSniff: true,
    xssFilter: true,
  }),
);

// Request logging
app.use(httpLogger);

// Body parsing
app.use(
  express.json({
    verify: (req: RequestWithRawBody, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cookieParser());

// Health routes at root level for infrastructure probe discovery (AWS ALB, K8s)
// Routes: GET /health, GET /ready, GET /live
app.use("/", healthRoutes);

// Metrics collection for all API routes
app.use(metricsMiddleware);
app.use("/api/v1", healthRoutes); // Also mount at /api/v1 for API tests

// API routes with rate limiting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/plaid", apiLimiter, plaidRoutes);
app.use("/api/v1/bank", apiLimiter, bankRoutes);
app.use("/api/v1/transaction", apiLimiter, transactionRoutes);
app.use("/api/v1/transfers", apiLimiter, transferRoutes);
app.use("/api/v1/transfers/p2p", p2pRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/webhooks", webhooksRoutes);
app.use("/api/v1", metricsRoutes);

// Sentry error handling
Sentry.setupExpressErrorHandler(app);

// Global error handler
import { errorHandler } from "@/middleware/errorHandler";
app.use(errorHandler);

export default app;
