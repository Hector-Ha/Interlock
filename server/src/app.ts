import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/config";

import authRoutes from "./routes/auth.routes";
import plaidRoutes from "./routes/plaid.routes";
import bankRoutes from "./routes/bank.routes";
import webhooksRoutes from "./routes/webhooks.routes";

interface RequestWithRawBody extends express.Request {
  rawBody?: Buffer;
}

const app: express.Application = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(
  express.json({
    verify: (req: RequestWithRawBody, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.env });
});

import { authLimiter, apiLimiter } from "@/middleware/rateLimit";

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/plaid", apiLimiter, plaidRoutes);
app.use("/api/v1/bank", apiLimiter, bankRoutes);
app.use("/api/v1/webhooks", webhooksRoutes);

Sentry.setupExpressErrorHandler(app);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export default app;
