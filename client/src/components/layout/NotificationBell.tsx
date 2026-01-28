"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  BellOff,
  X,
  Trash2,
  ArrowRightLeft,
  AlertTriangle,
  Building2,
  Shield,
  Send,
  Download,
  Loader2,
} from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { NotificationType } from "@/types/p2p";

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconClass = "h-4 w-4";

  switch (type) {
    case "P2P_RECEIVED":
      return <Download className={cn(iconClass, "text-emerald-500")} />;
    case "P2P_SENT":
      return <Send className={cn(iconClass, "text-blue-500")} />;
    case "TRANSFER_COMPLETED":
      return <ArrowRightLeft className={cn(iconClass, "text-emerald-500")} />;
    case "TRANSFER_FAILED":
      return <AlertTriangle className={cn(iconClass, "text-amber-500")} />;
    case "BANK_DISCONNECTED":
      return <Building2 className={cn(iconClass, "text-rose-500")} />;
    case "SECURITY_ALERT":
      return <Shield className={cn(iconClass, "text-rose-500")} />;
    default:
      return (
        <Bell className={cn(iconClass, "text-[var(--color-gray-main)]")} />
      );
  }
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    notifications,
    hasMore,
    isLoading,
    fetchNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    dismiss,
    dismissAll,
  } = useNotificationStore();

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

  const handleNotificationClick = useCallback(
    (notificationId: string, actionUrl: string | null) => {
      markAsRead(notificationId);
      if (actionUrl) {
        setIsOpen(false);
        router.push(actionUrl);
      }
    },
    [markAsRead, router],
  );

  const handleDismiss = useCallback(
    (e: React.MouseEvent, notificationId: string) => {
      e.stopPropagation();
      dismiss(notificationId);
    },
    [dismiss],
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      notificationId: string,
      actionUrl: string | null,
    ) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNotificationClick(notificationId, actionUrl);
      }
    },
    [handleNotificationClick],
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
          isOpen
            ? "bg-[var(--color-brand-surface)] text-[var(--color-brand-main)]"
            : "hover:bg-[var(--color-brand-surface)] text-[var(--color-brand-main)]",
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[var(--color-brand-main)] to-[var(--color-brand-hover)] text-white text-[10px] font-bold shadow-lg shadow-[var(--color-brand-main)]/30"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-[var(--color-gray-main)]/10 border border-[var(--color-gray-soft)] z-50 overflow-hidden"
          role="menu"
          aria-label="Notifications"
        >
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
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--color-brand-main)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-surface)] rounded-md transition-colors"
                  aria-label="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={dismissAll}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--color-gray-main)] hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                  aria-label="Dismiss all notifications"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

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
              <>
                <ul
                  className="divide-y divide-[var(--color-gray-soft)]"
                  role="list"
                >
                  {notifications.map((notification) => (
                    <li key={notification.id} role="menuitem">
                      <div
                        onClick={() =>
                          handleNotificationClick(
                            notification.id,
                            notification.actionUrl,
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            notification.id,
                            notification.actionUrl,
                          )
                        }
                        tabIndex={0}
                        role="button"
                        className={cn(
                          "w-full text-left p-4 hover:bg-[var(--color-gray-surface)]/50 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-main)] group",
                          !notification.isRead &&
                            "bg-[var(--color-brand-surface)]/30",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-gray-surface)] flex-shrink-0">
                            <NotificationIcon type={notification.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "text-sm text-[var(--color-gray-text)] truncate",
                                  !notification.isRead && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span
                                  className="w-2 h-2 rounded-full bg-[var(--color-brand-main)] flex-shrink-0"
                                  aria-label="Unread"
                                />
                              )}
                            </div>
                            <p className="text-sm text-[var(--color-gray-main)] mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[11px] text-[var(--color-gray-disabled)] mt-1.5">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDismiss(e, notification.id)}
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md hover:bg-[var(--color-gray-soft)] text-[var(--color-gray-main)] hover:text-rose-500 transition-all"
                            aria-label={`Dismiss ${notification.title}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <div className="p-3 border-t border-[var(--color-gray-soft)]">
                    <button
                      onClick={loadMoreNotifications}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-[var(--color-brand-main)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-surface)] rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load more"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
