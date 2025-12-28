import { Router } from "express";
import { handleDwollaWebhook } from "@/controllers/webhooks.controller";

const router: Router = Router();

router.post("/dwolla", handleDwollaWebhook);

export default router;

