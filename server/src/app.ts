import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import plaidRoutes from "./routes/plaid.routes";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plaid", plaidRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
