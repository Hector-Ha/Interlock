import { Router, RequestHandler } from "express";
import { signUp, signIn, getMe, signOut } from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.post("/sign-up", signUp as RequestHandler);
router.post("/sign-in", signIn as RequestHandler);
router.get("/me", authenticate, getMe as RequestHandler);
router.post("/sign-out", signOut as RequestHandler);

export default router;
