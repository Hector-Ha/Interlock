import { create } from "zustand";
import * as Sentry from "@sentry/nextjs";
import { notificationService } from "@/services/notification.service";
import type {
  Notification,
  NotificationPreference,
  NotificationType,
} from "@/types/p2p";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: NotificationPreference[];
  preferencesLoading: boolean;

  fetchNotifications: (options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }) => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismiss: (notificationId: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  updatePreference: (
    type: NotificationType,
    data: { inAppEnabled?: boolean; emailEnabled?: boolean },
  ) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const NOTIFICATIONS_PER_PAGE = 10;

const initialState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  hasMore: false,
  isLoading: false,
  error: null,
  preferences: [],
  preferencesLoading: false,
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  fetchNotifications: async (options) => {
    try {
      set({ isLoading: true, error: null });

      const { notifications, total, hasMore } =
        await notificationService.getNotifications({
          limit: options?.limit ?? NOTIFICATIONS_PER_PAGE,
          ...options,
        });

      set({
        notifications,
        total,
        hasMore,
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      set({ isLoading: false, error: message });
    }
  },

  loadMoreNotifications: async () => {
    const { notifications, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    try {
      set({ isLoading: true, error: null });

      const {
        notifications: newNotifications,
        total,
        hasMore: moreAvailable,
      } = await notificationService.getNotifications({
        limit: NOTIFICATIONS_PER_PAGE,
        offset: notifications.length,
      });

      set((state) => ({
        notifications: [...state.notifications, ...newNotifications],
        total,
        hasMore: moreAvailable,
        isLoading: false,
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load more notifications";
      set({ isLoading: false, error: message });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { count } = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch (err) {
      Sentry.captureException(err, {
        tags: { component: "notification-store", action: "fetchUnreadCount" },
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    const currentNotifications = get().notifications;
    const targetNotification = currentNotifications.find(
      (n) => n.id === notificationId,
    );

    if (!targetNotification || targetNotification.isRead) {
      return;
    }

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await notificationService.markAsRead(notificationId);
    } catch (err) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: false, readAt: null } : n,
        ),
        unreadCount: state.unreadCount + 1,
        error: "Failed to mark notification as read",
      }));
    }
  },

  markAllAsRead: async () => {
    const currentNotifications = get().notifications;
    const currentUnreadCount = get().unreadCount;

    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.isRead ? n.readAt : new Date().toISOString(),
      })),
      unreadCount: 0,
    }));

    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      set({
        notifications: currentNotifications,
        unreadCount: currentUnreadCount,
        error: "Failed to mark all notifications as read",
      });
    }
  },

  dismiss: async (notificationId: string) => {
    const currentNotifications = get().notifications;
    const targetNotification = currentNotifications.find(
      (n) => n.id === notificationId,
    );

    if (!targetNotification) return;

    const wasUnread = !targetNotification.isRead;

    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
      total: Math.max(0, state.total - 1),
      unreadCount: wasUnread
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }));

    try {
      await notificationService.dismiss(notificationId);
    } catch (err) {
      set((state) => ({
        notifications: [targetNotification, ...state.notifications],
        total: state.total + 1,
        unreadCount: wasUnread ? state.unreadCount + 1 : state.unreadCount,
        error: "Failed to dismiss notification",
      }));
    }
  },

  dismissAll: async () => {
    const currentNotifications = get().notifications;
    const currentTotal = get().total;
    const currentUnreadCount = get().unreadCount;

    set({
      notifications: [],
      total: 0,
      unreadCount: 0,
      hasMore: false,
    });

    try {
      await notificationService.dismissAll();
    } catch (err) {
      set({
        notifications: currentNotifications,
        total: currentTotal,
        unreadCount: currentUnreadCount,
        hasMore: currentNotifications.length < currentTotal,
        error: "Failed to dismiss all notifications",
      });
    }
  },

  fetchPreferences: async () => {
    try {
      set({ preferencesLoading: true });
      const { preferences } = await notificationService.getPreferences();
      set({ preferences, preferencesLoading: false });
    } catch (err) {
      set({ preferencesLoading: false });
      Sentry.captureException(err, {
        tags: { component: "notification-store", action: "fetchPreferences" },
      });
    }
  },

  updatePreference: async (type, data) => {
    const currentPreferences = get().preferences;
    const currentPref = currentPreferences.find((p) => p.type === type);

    set((state) => ({
      preferences: state.preferences.map((p) =>
        p.type === type ? { ...p, ...data } : p,
      ),
    }));

    try {
      await notificationService.updatePreference(type, data);
    } catch (err) {
      if (currentPref) {
        set((state) => ({
          preferences: state.preferences.map((p) =>
            p.type === type ? currentPref : p,
          ),
          error: "Failed to update preference",
        }));
      }
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
