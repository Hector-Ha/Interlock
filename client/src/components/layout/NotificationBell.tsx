"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";
import { cn, formatRelativeTime } from "@/lib/utils";

// Bell icon with notification dropdown showing recent notifications.
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  // Use polling hook for unread count with visibility-aware polling
  const { unreadCount } = useNotificationPolling({
    enabled: true,
    interval: 30000,
    showToastOnNew: true,
  });

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-surface-alt transition-colors"
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
      >
        <Bell className="h-5 w-5 text-content-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-error-main text-white text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-content-primary">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-brand-main hover:text-brand-hover flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-content-secondary">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.slice(0, 10).map((notification) => (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification.id)}
                      className={cn(
                        "w-full text-left p-3 hover:bg-surface-alt cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        !notification.isRead && "bg-brand-surface",
                      )}
                      aria-label={`${!notification.isRead ? "Unread: " : ""}${notification.title}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm text-content-primary",
                              !notification.isRead && "font-medium",
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-content-secondary">
                            {notification.message}
                          </p>
                          <p className="text-xs text-content-tertiary mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div
                            className="h-2 w-2 rounded-full bg-brand-main flex-shrink-0 mt-1.5"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
