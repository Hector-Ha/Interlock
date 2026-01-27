import { Router, RequestHandler } from "express";
import { authenticate } from "@/middleware/auth";
import { apiLimiter } from "@/middleware/rateLimit";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  dismissAllNotifications,
  getPreferences,
  updatePreference,
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

// Dismiss single notification (soft delete)
router.patch("/:id/dismiss", dismissNotification as RequestHandler);

// Dismiss all notifications (soft delete)
router.post("/dismiss-all", dismissAllNotifications as RequestHandler);

// Get all user preferences
router.get("/preferences", getPreferences as RequestHandler);

// Update a single preference by type
router.patch("/preferences/:type", updatePreference as RequestHandler);

export default router;
