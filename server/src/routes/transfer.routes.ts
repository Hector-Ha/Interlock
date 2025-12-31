import { Router, RequestHandler } from "express";
import { authenticate } from "@/middleware/auth";
import {
  getTransfer,
  getTransfers,
  cancelTransfer,
} from "@/controllers/transfer.controller";

const router: Router = Router();

// List user's transfers with pagination and filtering
router.get("/", authenticate, getTransfers as RequestHandler);

// Get a single transfer by ID
router.get("/:transferId", authenticate, getTransfer as RequestHandler);

// Cancel a pending transfer
router.post(
  "/:transferId/cancel",
  authenticate,
  cancelTransfer as RequestHandler
);

export default router;
