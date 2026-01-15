import { prisma } from "@/db";
import type { Notification, NotificationType } from "../generated/client";

// Types
interface CreateNotificationData {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTransactionId?: string;
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

// Service
export const notificationService = {
  //Create
  async create(data: CreateNotificationData): Promise<Notification> {
    return prisma.notification.create({ data });
  },

  //Get
  async getByUserId(
    userId: string,
    options: GetNotificationsOptions = {},
  ): Promise<NotificationListResult> {
    const { limit = 20, offset = 0, unreadOnly = false } = options;

    const where = {
      recipientUserId: userId,
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

  //Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { recipientUserId: userId, isRead: false },
    });
  },

  //Mark as read
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, recipientUserId: userId },
      data: { isRead: true, readAt: new Date() },
    });
  },

  //Mark all as read
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientUserId: userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },
};
