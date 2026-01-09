import { Router, RequestHandler } from "express";
import { authenticate } from "@/middleware/auth";
import { apiLimiter } from "@/middleware/rateLimit";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "@/controllers/notification.controller";

const router: Router = Router();

// Apply authentication and rate limiting to all notification routes
router.use(authenticate);
router.use(apiLimiter);

// List notifications with pagination
router.get("/", getNotifications as RequestHandler);

// Get unread count for badge
router.get("/unread-count", getUnreadCount as RequestHandler);

// Mark single notification as read
router.patch("/:id/read", markAsRead as RequestHandler);

// Mark all notifications as read
router.post("/read-all", markAllAsRead as RequestHandler);

export default router;
