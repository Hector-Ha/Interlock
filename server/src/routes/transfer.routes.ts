import { Router } from "express";
import { createTransfer } from "../controllers/transfer.controller";
import { authenticate } from "../middleware/auth";
import { handleWebhook } from "../controllers/webhook.controller";

const router = Router();

router.post("/", authenticate, createTransfer);
// Webhook route - Unprotected!
router.post("/webhook", handleWebhook);

export default router;
