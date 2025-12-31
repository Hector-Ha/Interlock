import { Router, RequestHandler } from "express";
import {
  signUp,
  signIn,
  getMe,
  signOut,
  refreshToken,
  logoutAll,
  changePassword,
  updateProfile,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth";

const router: Router = Router();

router.post("/sign-up", signUp as RequestHandler);
router.post("/sign-in", signIn as RequestHandler);
router.get("/me", authenticate, getMe as RequestHandler);
router.post("/sign-out", signOut as RequestHandler);
router.post("/refresh", refreshToken as RequestHandler);
router.post("/logout-all", authenticate, logoutAll as RequestHandler);
router.post("/change-password", authenticate, changePassword as RequestHandler);
router.patch("/profile", authenticate, updateProfile as RequestHandler);

export default router;
