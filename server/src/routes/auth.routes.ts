import { Router } from "express";
import { signUp, signIn, getMe, signOut } from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/me", authenticate, getMe);
router.post("/sign-out", signOut);

export default router;
