import { Router } from "express";
import { createCustomer } from "../controllers/dwolla.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/customers", authenticate, createCustomer);

export default router;
