import { Router, RequestHandler } from "express";
import {
  linkBankWithDwolla,
  getBanks,
  initiateTransfer,
} from "@/controllers/bank.controller";
import {
  getAccounts,
  getAccountBalance,
} from "@/controllers/account.controller";
import {
  getTransactions,
  syncTransactions,
} from "@/controllers/transaction.controller";
import { authenticate } from "@/middleware/auth";
import { apiLimiter } from "@/middleware/rateLimit";

const router: Router = Router();

router.get("/", authenticate, getBanks as RequestHandler);
router.post("/link-dwolla", authenticate, linkBankWithDwolla as RequestHandler);
router.post("/transfer", authenticate, initiateTransfer as RequestHandler);

// Account Endpoints
router.get("/:bankId/accounts", authenticate, getAccounts as RequestHandler);
router.get(
  "/:bankId/accounts/:accountId/balance",
  authenticate,
  getAccountBalance as RequestHandler
);

// Transaction Endpoints
router.get(
  "/:bankId/transactions",
  authenticate,
  getTransactions as RequestHandler
);
router.post(
  "/:bankId/sync",
  authenticate,
  apiLimiter,
  syncTransactions as RequestHandler
);

export default router;
