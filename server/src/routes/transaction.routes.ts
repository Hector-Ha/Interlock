import { Router, RequestHandler } from "express";
import { authenticate } from "@/middleware/auth";
import { getTransaction } from "@/controllers/transaction.controller";

const router: Router = Router();

router.get("/:transactionId", authenticate, getTransaction as RequestHandler);

export default router;
