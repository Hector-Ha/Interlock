import { Router } from "express";
import {
  createLinkToken,
  exchangePublicToken,
} from "../controllers/plaid.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/create_link_token", authenticate, createLinkToken);
router.post("/exchange_public_token", authenticate, exchangePublicToken);

export default router;
