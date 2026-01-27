import { prisma } from "@/db";
import type { Notification, NotificationType } from "../generated/client";

const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  "P2P_RECEIVED",
  "P2P_SENT",
  "TRANSFER_COMPLETED",
  "TRANSFER_FAILED",
  "BANK_DISCONNECTED",
  "SECURITY_ALERT",
];

// Types
interface CreateNotificationData {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTransactionId?: string;
  actionUrl?: string;
}

interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

interface NotificationListResult {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

interface NotificationPreferenceData {
  type: NotificationType;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

// Service
export const notificationService = {
  // Create notification
  async create(data: CreateNotificationData): Promise<Notification> {
    return prisma.notification.create({ data });
  },

  // Get notification
  async getByUserId(
    userId: string,
    options: GetNotificationsOptions = {},
  ): Promise<NotificationListResult> {
    const { limit = 20, offset = 0, unreadOnly = false } = options;

    const where = {
      recipientUserId: userId,
      dismissedAt: null, // Exclude dismissed notifications
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      hasMore: offset + notifications.length < total,
    };
  },

  // Get unread count (excluding dismissed)
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { recipientUserId: userId, isRead: false, dismissedAt: null },
    });
  },

  // Mark as read
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, recipientUserId: userId },
      data: { isRead: true, readAt: new Date() },
    });
  },

  // Mark all as read
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientUserId: userId, isRead: false, dismissedAt: null },
      data: { isRead: true, readAt: new Date() },
    });
  },

  // Dismiss a single notification (soft delete)
  async dismiss(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, recipientUserId: userId, dismissedAt: null },
      data: { dismissedAt: new Date() },
    });
  },

  // Dismiss all notifications (soft delete)
  async dismissAll(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientUserId: userId, dismissedAt: null },
      data: { dismissedAt: new Date() },
    });
  },

  // Get user notification preferences
  async getPreferences(userId: string): Promise<NotificationPreferenceData[]> {
    const prefs = await prisma.notificationPreference.findMany({
      where: { userId },
    });

    // Return all types, filling in defaults for any that don't exist
    return ALL_NOTIFICATION_TYPES.map((type) => {
      const existing = prefs.find((p) => p.type === type);
      return {
        type,
        inAppEnabled: existing?.inAppEnabled ?? true,
        emailEnabled: existing?.emailEnabled ?? true,
      };
    });
  },

  // Update a single notification preference
  async updatePreference(
    userId: string,
    type: NotificationType,
    data: { inAppEnabled?: boolean; emailEnabled?: boolean },
  ) {
    return prisma.notificationPreference.upsert({
      where: { userId_type: { userId, type } },
      create: { userId, type, inAppEnabled: true, emailEnabled: true, ...data },
      update: data,
    });
  },

  // Check if a notification should be created based on user preferences
  async shouldNotify(
    userId: string,
    type: NotificationType,
    channel: "inApp" | "email",
  ): Promise<boolean> {
    const pref = await prisma.notificationPreference.findUnique({
      where: { userId_type: { userId, type } },
    });

    // If no preference exists, default to enabled
    if (!pref) return true;

    return channel === "inApp" ? pref.inAppEnabled : pref.emailEnabled;
  },
};
