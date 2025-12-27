import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import plaidRoutes from "./routes/plaid.routes";
import dwollaRoutes from "./routes/dwolla.routes";
import transferRoutes from "./routes/transfer.routes";
import transactionRoutes from "./routes/transaction.routes";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/dwolla", dwollaRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

Sentry.setupExpressErrorHandler(app);

export default app;
