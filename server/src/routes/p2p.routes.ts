import { Router, RequestHandler } from "express";
import { authenticate } from "@/middleware/auth";
import { apiLimiter } from "@/middleware/rateLimit";
import {
  searchRecipients,
  createP2PTransfer,
} from "@/controllers/p2p.controller";

const router: Router = Router();

// Apply authentication and rate limiting to all P2P routes
router.use(authenticate);
router.use(apiLimiter);

// Search for recipients
router.get("/recipients/search", searchRecipients as RequestHandler);

// Create P2P transfer
router.post("/", createP2PTransfer as RequestHandler);

export default router;
