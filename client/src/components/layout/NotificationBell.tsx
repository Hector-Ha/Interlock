"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, BellOff } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";
import { cn, formatRelativeTime } from "@/lib/utils";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  const { unreadCount } = useNotificationPolling({
    enabled: true,
    interval: 30000,
    showToastOnNew: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

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
        className={cn(
          "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
          isOpen
            ? "bg-[var(--color-brand-surface)] text-[var(--color-brand-main)]"
            : "hover:bg-[var(--color-gray-surface)] text-[var(--color-gray-main)]"
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] text-white text-[10px] font-bold shadow-lg shadow-[var(--color-brand-main)]/30">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-[var(--color-gray-main)]/10 border border-[var(--color-gray-soft)] z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--color-brand-main)]" />
              <h3 className="font-semibold text-[var(--color-gray-text)]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-brand-main)] text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-brand-main)] hover:text-[var(--color-brand-hover)] transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-gray-surface)] mb-4">
                  <BellOff className="h-7 w-7 text-[var(--color-gray-disabled)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-gray-text)] mb-1">
                  All caught up!
                </p>
                <p className="text-xs text-[var(--color-gray-main)]">
                  No new notifications
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-gray-soft)]">
                {notifications.slice(0, 10).map((notification) => (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification.id)}
                      className={cn(
                        "w-full text-left p-4 hover:bg-[var(--color-gray-surface)]/50 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-main)]",
                        !notification.isRead && "bg-[var(--color-brand-surface)]/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                "text-sm text-[var(--color-gray-text)] truncate",
                                !notification.isRead && "font-semibold"
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-main)] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-[var(--color-gray-main)] mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-[var(--color-gray-disabled)] mt-1.5">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
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
