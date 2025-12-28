import { Router } from "express";
import {
  linkBankWithDwolla,
  getBanks,
  initiateTransfer,
} from "@/controllers/bank.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.get("/", authenticate, getBanks);
router.post("/link-dwolla", authenticate, linkBankWithDwolla);
router.post("/transfer", authenticate, initiateTransfer);

export default router;
