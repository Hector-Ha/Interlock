import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/config";

import authRoutes from "./routes/auth.routes";
import plaidRoutes from "./routes/plaid.routes";
import bankRoutes from "./routes/bank.routes";
import dwollaRoutes from "./routes/dwolla.routes";
import transferRoutes from "./routes/transfer.routes";
import transactionRoutes from "./routes/transaction.routes";

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
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.env });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/plaid", plaidRoutes);
app.use("/api/v1/bank", bankRoutes);
app.use("/api/v1/dwolla", dwollaRoutes);
app.use("/api/v1/transfer", transferRoutes);
app.use("/api/v1/transactions", transactionRoutes);

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
