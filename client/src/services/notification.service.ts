import { api } from "./api-client";
import type { Notification } from "@/types/p2p";

interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

interface UnreadCountResponse {
  count: number;
}

interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

// Notification service for handling in-app notification API calls.
export const notificationService = {
  // Retrieves notifications for the current user with pagination support.
  getNotifications: async (
    options?: GetNotificationsOptions
  ): Promise<NotificationListResponse> => {
    return api.get<NotificationListResponse>("/notifications", {
      params: options,
    });
  },

  // Gets the count of unread notifications for badge display.
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return api.get<UnreadCountResponse>("/notifications/unread-count");
  },

  // Marks a single notification as read.

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  // Marks all notifications for the current user as read.
  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/read-all");
  },
};

export type {
  NotificationListResponse,
  UnreadCountResponse,
  GetNotificationsOptions,
};
