"use client";

import { Bell, Mail, Smartphone, Shield, CreditCard, ArrowRightLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  enabled?: boolean;
}

const notificationTypes: NotificationItem[] = [
  {
    id: "security",
    icon: <Shield className="h-5 w-5" />,
    title: "Security Alerts",
    description: "Get notified about login attempts and security events",
    iconBg: "bg-[var(--color-success-surface)]",
    iconColor: "text-[var(--color-success-main)]",
    enabled: true,
  },
  {
    id: "transfers",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    title: "Transfer Updates",
    description: "Receive updates when transfers are completed",
    iconBg: "bg-[var(--color-brand-surface)]",
    iconColor: "text-[var(--color-brand-main)]",
    enabled: false,
  },
  {
    id: "payments",
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payment Reminders",
    description: "Get reminded about upcoming payments",
    iconBg: "bg-[var(--color-warning-surface)]",
    iconColor: "text-[var(--color-warning-main)]",
    enabled: false,
  },
  {
    id: "weekly",
    icon: <Clock className="h-5 w-5" />,
    title: "Weekly Summary",
    description: "Receive a weekly summary of your account activity",
    iconBg: "bg-[var(--color-gray-surface)]",
    iconColor: "text-[var(--color-gray-main)]",
    enabled: false,
  },
];

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Notification Overview Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-warning-text)] via-[#4a3520] to-[var(--color-gray-text)]"
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="notification-dots"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#notification-dots)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-warning-main)] rounded-full blur-[100px] opacity-30" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Bell className="h-7 w-7 text-[var(--color-warning-main)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                Notification Preferences
              </h2>
              <p className="text-white/60 text-sm mt-0.5">
                Control how and when you receive notifications
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10">
                  <Mail className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70 font-medium">Email</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10">
                  <Smartphone className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70 font-medium">Push</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Coming Soon Card */}
      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-warning-surface)]">
              <Bell className="h-5 w-5 text-[var(--color-warning-main)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Notification Types
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                Choose which notifications you want to receive
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <Alert variant="info" className="border-[var(--color-brand-soft)]">
            <AlertDescription>
              Full notification preferences will be available when P2P transfers are
              enabled. Currently, only security alerts are active.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {notificationTypes.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  notification.enabled
                    ? "bg-[var(--color-gray-surface)] border-[var(--color-success-soft)]"
                    : "bg-[var(--color-gray-surface)]/50 border-[var(--color-gray-soft)] opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl",
                      notification.iconBg
                    )}
                  >
                    <span className={notification.iconColor}>
                      {notification.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-gray-text)]">
                      {notification.title}
                    </p>
                    <p className="text-xs text-[var(--color-gray-main)]">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-6 rounded-full transition-colors cursor-not-allowed",
                    notification.enabled
                      ? "bg-[var(--color-success-main)]"
                      : "bg-[var(--color-gray-disabled)]"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                      notification.enabled ? "translate-x-3" : "-translate-x-3"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-[var(--color-gray-main)] pt-2">
            More notification options coming soon
          </p>
        </div>
      </Card>
    </div>
  );
}
