"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNotificationStore } from "@/stores/notification.store";
import { notificationService } from "@/services/notification.service";
import { toast } from "@/stores/toast.store";

interface UseNotificationPollingOptions {
  enabled?: boolean;
  interval?: number;
  showToastOnNew?: boolean;
}

interface UseNotificationPollingResult {
  unreadCount: number;
  refresh: () => Promise<void>;
}

// Polls for new notifications and shows toast for high-priority alerts.
// Pauses polling when the tab is not visible to save resources.
export function useNotificationPolling(
  options: UseNotificationPollingOptions = {}
): UseNotificationPollingResult {
  const { enabled = true, interval = 30000, showToastOnNew = true } = options;

  const { unreadCount, fetchUnreadCount, fetchNotifications } =
    useNotificationStore();
  const previousCountRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkForNewNotifications = useCallback(async () => {
    // Skip if tab is hidden
    if (document.hidden) {
      return;
    }

    try {
      const { count } = await notificationService.getUnreadCount();

      // If count increased and we have a previous count, show toast
      if (
        showToastOnNew &&
        previousCountRef.current !== null &&
        count > previousCountRef.current
      ) {
        const newCount = count - previousCountRef.current;

        // Fetch latest unread notification for toast content
        const { notifications } = await notificationService.getNotifications({
          limit: 1,
          unreadOnly: true,
        });

        if (notifications.length > 0) {
          const latest = notifications[0];
          toast.info(
            latest.title,
            newCount > 1
              ? `${latest.message} (+${newCount - 1} more)`
              : latest.message
          );
        }
      }

      // Update store and ref
      useNotificationStore.setState({ unreadCount: count });
      previousCountRef.current = count;
    } catch (error) {
      console.error("Failed to poll notifications:", error);
    }
  }, [showToastOnNew]);

  // Initialize previous count on mount
  useEffect(() => {
    if (enabled) {
      previousCountRef.current = unreadCount;
    }
  }, [enabled, unreadCount]);

  // Setup polling interval
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial fetch
    fetchUnreadCount();

    // Start polling
    intervalRef.current = setInterval(checkForNewNotifications, interval);

    // Handle visibility change to pause/resume
    const handleVisibilityChange = () => {
      if (!document.hidden && intervalRef.current) {
        // Tab became visible, do an immediate check
        checkForNewNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, interval, checkForNewNotifications, fetchUnreadCount]);

  const refresh = useCallback(async () => {
    await fetchUnreadCount();
    await fetchNotifications();
  }, [fetchUnreadCount, fetchNotifications]);

  return {
    unreadCount,
    refresh,
  };
}
