import { Router } from "express";
import {
  createLinkTokenHandler,
  exchangeTokenHandler,
} from "@/controllers/plaid.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.post("/link-token", authenticate, createLinkTokenHandler);
router.post("/exchange-token", authenticate, exchangeTokenHandler);

export default router;
