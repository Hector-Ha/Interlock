import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "@/middleware/auth";
import { notificationService } from "@/services/notification.service";

// Query schema for listing notifications
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
  unreadOnly: z.coerce.boolean().default(false),
});

// Get user notifications with pagination.
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const options = querySchema.parse(req.query);
    const result = await notificationService.getByUserId(
      req.user.userId,
      options
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: error.issues[0].message,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    console.error("Get Notifications Error:", error);
    res.status(500).json({
      message: "Failed to get notifications",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Get unread notification count for badge.
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.userId);
    res.json({ count });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    res.status(500).json({
      message: "Failed to get unread count",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Mark a notification as read.
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id, req.user.userId);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark As Read Error:", error);
    res.status(500).json({
      message: "Failed to mark notification as read",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Mark all notifications as read.
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await notificationService.markAllAsRead(req.user.userId);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark All As Read Error:", error);
    res.status(500).json({
      message: "Failed to mark notifications as read",
      code: "NOTIFICATION_ERROR",
    });
  }
};
