import { Router } from "express";
import {
  handleDwollaWebhook,
  handlePlaidWebhook,
} from "@/controllers/webhooks.controller";

const router: Router = Router();

// Dwolla transfer webhooks
router.post("/dwolla", handleDwollaWebhook);

// Plaid ITEM webhooks (bank disconnection, etc.)
router.post("/plaid", handlePlaidWebhook);

export default router;
