import { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "@/types/auth.types";
import { logger } from "@/middleware/logger";
import { notificationService } from "@/services/notification.service";
import type { NotificationType } from "../generated/client";

// Query schema for listing notifications
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
  unreadOnly: z.coerce.boolean().default(false),
});

// Schema for updating notification preferences
const updatePreferenceSchema = z.object({
  inAppEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
});

// Valid notification types for validation
const validNotificationTypes = [
  "P2P_RECEIVED",
  "P2P_SENT",
  "TRANSFER_COMPLETED",
  "TRANSFER_FAILED",
  "BANK_DISCONNECTED",
  "SECURITY_ALERT",
] as const;

// Get user notifications with pagination.
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const options = querySchema.parse(req.query);
    const result = await notificationService.getByUserId(
      req.user.userId,
      options,
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

    logger.error({ err: error }, "Get Notifications Error");
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
    logger.error({ err: error }, "Get Unread Count Error");
    res.status(500).json({
      message: "Failed to get unread count",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Mark a notification as read.
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await notificationService.markAsRead(id, req.user.userId);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    logger.error({ err: error }, "Mark As Read Error");
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
    logger.error({ err: error }, "Mark All As Read Error");
    res.status(500).json({
      message: "Failed to mark notifications as read",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Dismiss a single notification (soft delete).
export const dismissNotification = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await notificationService.dismiss(id, req.user.userId);
    res.json({ message: "Notification dismissed" });
  } catch (error) {
    logger.error({ err: error }, "Dismiss Notification Error");
    res.status(500).json({
      message: "Failed to dismiss notification",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Dismiss all notifications (soft delete).
export const dismissAllNotifications = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    await notificationService.dismissAll(req.user.userId);
    res.json({ message: "All notifications dismissed" });
  } catch (error) {
    logger.error({ err: error }, "Dismiss All Notifications Error");
    res.status(500).json({
      message: "Failed to dismiss notifications",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Get user notification preferences.
export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const preferences = await notificationService.getPreferences(
      req.user.userId,
    );
    res.json({ preferences });
  } catch (error) {
    logger.error({ err: error }, "Get Preferences Error");
    res.status(500).json({
      message: "Failed to get notification preferences",
      code: "NOTIFICATION_ERROR",
    });
  }
};

// Update a single notification preference.
export const updatePreference = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;

    // Validate notification type
    if (!validNotificationTypes.includes(type as NotificationType)) {
      res.status(400).json({
        message: "Invalid notification type",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    const data = updatePreferenceSchema.parse(req.body);

    // Ensure at least one field is provided
    if (data.inAppEnabled === undefined && data.emailEnabled === undefined) {
      res.status(400).json({
        message:
          "At least one of inAppEnabled or emailEnabled must be provided",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    const preference = await notificationService.updatePreference(
      req.user.userId,
      type as NotificationType,
      data,
    );
    res.json({ preference });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: error.issues[0].message,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    logger.error({ err: error }, "Update Preference Error");
    res.status(500).json({
      message: "Failed to update notification preference",
      code: "NOTIFICATION_ERROR",
    });
  }
};
