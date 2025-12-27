import { Router } from "express";
import { syncTransactions } from "../controllers/transaction.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/sync", authenticate, syncTransactions);

export default router;
