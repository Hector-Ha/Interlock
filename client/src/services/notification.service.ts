import { api } from "./api-client";
import type {
  Notification,
  NotificationPreference,
  NotificationType,
} from "@/types/p2p";

interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

interface UnreadCountResponse {
  count: number;
}

interface PreferencesResponse {
  preferences: NotificationPreference[];
}

interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

interface UpdatePreferenceData {
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
}

export const notificationService = {
  getNotifications: async (
    options?: GetNotificationsOptions,
  ): Promise<NotificationListResponse> => {
    return api.get<NotificationListResponse>("/notifications", {
      params: options,
    });
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return api.get<UnreadCountResponse>("/notifications/unread-count");
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/read-all");
  },

  dismiss: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/dismiss`);
  },

  dismissAll: async (): Promise<void> => {
    await api.post("/notifications/dismiss-all");
  },

  getPreferences: async (): Promise<PreferencesResponse> => {
    return api.get<PreferencesResponse>("/notifications/preferences");
  },

  updatePreference: async (
    type: NotificationType,
    data: UpdatePreferenceData,
  ): Promise<NotificationPreference> => {
    return api.patch<NotificationPreference>(
      `/notifications/preferences/${type}`,
      data,
    );
  },
};

export type {
  NotificationListResponse,
  UnreadCountResponse,
  GetNotificationsOptions,
  PreferencesResponse,
  UpdatePreferenceData,
};
