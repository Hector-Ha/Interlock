import { Router, RequestHandler } from "express";
import {
  createLinkTokenHandler,
  exchangeTokenHandler,
  createUpdateLinkTokenHandler,
} from "@/controllers/plaid.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.post(
  "/link-token",
  authenticate,
  createLinkTokenHandler as RequestHandler
);
router.post(
  "/exchange-token",
  authenticate,
  exchangeTokenHandler as RequestHandler
);
router.post(
  "/update-link-token",
  authenticate,
  createUpdateLinkTokenHandler as RequestHandler
);

export default router;
