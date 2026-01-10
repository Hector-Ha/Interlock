import { create } from "zustand";
import * as Sentry from "@sentry/nextjs";
import { notificationService } from "@/services/notification.service";
import type { Notification } from "@/types/p2p";

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  hasMore: false,
  isLoading: false,
  error: null,
};

// Handles fetching notifications, unread counts, and mark-as-read operations.
export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  fetchNotifications: async (options) => {
    try {
      set({ isLoading: true, error: null });

      const { notifications, total, hasMore } =
        await notificationService.getNotifications(options);

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

  fetchUnreadCount: async () => {
    try {
      const { count } = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch (err) {
      // Silently fail for unread count (non-critical operation)
      // Log to Sentry for production monitoring
      Sentry.captureException(err, {
        tags: { component: "notification-store", action: "fetchUnreadCount" },
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    const currentNotifications = get().notifications;
    const targetNotification = currentNotifications.find(
      (n) => n.id === notificationId
    );

    // Don't do anything if already read
    if (!targetNotification || targetNotification.isRead) {
      return;
    }

    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await notificationService.markAsRead(notificationId);
    } catch (err) {
      // Rollback on failure
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: false, readAt: null } : n
        ),
        unreadCount: state.unreadCount + 1,
        error: "Failed to mark notification as read",
      }));
    }
  },

  markAllAsRead: async () => {
    const currentNotifications = get().notifications;
    const currentUnreadCount = get().unreadCount;

    // Optimistic update
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
      // Rollback on failure
      set({
        notifications: currentNotifications,
        unreadCount: currentUnreadCount,
        error: "Failed to mark all notifications as read",
      });
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
