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
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyEmail,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth";
import { authLimiter } from "@/middleware/rateLimit";

const router: Router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

router.post("/sign-up", signUp as RequestHandler);
router.post("/sign-in", signIn as RequestHandler);
router.get("/me", authenticate, getMe as RequestHandler);
router.post("/sign-out", signOut as RequestHandler);
router.post("/refresh", refreshToken as RequestHandler);
router.post("/logout-all", authenticate, logoutAll as RequestHandler);
router.post("/change-password", authenticate, changePassword as RequestHandler);
router.patch("/profile", authenticate, updateProfile as RequestHandler);
router.post("/forgot-password", forgotPassword as RequestHandler);
router.post("/reset-password", resetPassword as RequestHandler);
router.post(
  "/send-verification",
  authenticate,
  sendVerification as RequestHandler,
);
router.post("/verify-email", verifyEmail as RequestHandler);

export default router;
