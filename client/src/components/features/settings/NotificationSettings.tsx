"use client";

import { useEffect } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Shield,
  ArrowRightLeft,
  AlertTriangle,
  Building2,
  Send,
  Download,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notification.store";
import type { NotificationType } from "@/types/p2p";

interface NotificationTypeConfig {
  type: NotificationType;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const notificationTypeConfigs: NotificationTypeConfig[] = [
  {
    type: "SECURITY_ALERT",
    icon: <Shield className="h-5 w-5" />,
    title: "Security Alerts",
    description: "Get notified about login attempts and security events",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    type: "TRANSFER_COMPLETED",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    title: "Transfer Completed",
    description: "Receive updates when transfers are successfully completed",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    type: "TRANSFER_FAILED",
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Transfer Failed",
    description: "Get notified when a transfer fails or is returned",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    type: "P2P_RECEIVED",
    icon: <Download className="h-5 w-5" />,
    title: "Money Received",
    description: "Get notified when you receive money from someone",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    type: "P2P_SENT",
    icon: <Send className="h-5 w-5" />,
    title: "Money Sent",
    description: "Get notified when your payment is successfully sent",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    type: "BANK_DISCONNECTED",
    icon: <Building2 className="h-5 w-5" />,
    title: "Bank Connection Issues",
    description: "Get notified when your bank connection needs attention",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2",
        enabled
          ? "bg-[var(--color-success-main)]"
          : "bg-[var(--color-gray-disabled)]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

function NotificationSettingsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-gray-soft)]" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-[var(--color-gray-soft)] rounded" />
              <div className="h-3 w-48 bg-[var(--color-gray-soft)] rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-11 bg-[var(--color-gray-soft)] rounded-full" />
            <div className="h-6 w-11 bg-[var(--color-gray-soft)] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationSettings() {
  const {
    preferences,
    preferencesLoading,
    fetchPreferences,
    updatePreference,
  } = useNotificationStore();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const getPreference = (type: NotificationType) => {
    return (
      preferences.find((p) => p.type === type) ?? {
        type,
        inAppEnabled: true,
        emailEnabled: true,
      }
    );
  };

  const handleToggle = (
    type: NotificationType,
    channel: "inAppEnabled" | "emailEnabled",
    value: boolean,
  ) => {
    updatePreference(type, { [channel]: value });
  };

  return (
    <div className="space-y-6">
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-warning-text)] via-[#4a3520] to-[var(--color-gray-text)]"
      >
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
                  <Smartphone className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70 font-medium">
                    In-App
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10">
                  <Mail className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70 font-medium">
                    Email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-warning-surface)]">
              <Bell className="h-5 w-5 text-[var(--color-warning-main)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Notification Types
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                Choose which notifications you want to receive
              </p>
            </div>
            {preferencesLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-gray-main)]" />
            )}
          </div>
        </div>

        <div className="p-5">
          {preferencesLoading && preferences.length === 0 ? (
            <NotificationSettingsSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-end gap-3 pb-2 pr-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-main)]">
                  <Smartphone className="h-3.5 w-3.5" />
                  In-App
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-main)]">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </div>
              </div>

              {notificationTypeConfigs.map((config) => {
                const pref = getPreference(config.type);
                return (
                  <div
                    key={config.type}
                    className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/50 hover:bg-[var(--color-gray-surface)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl",
                          config.iconBg,
                        )}
                      >
                        <span className={config.iconColor}>{config.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-gray-text)]">
                          {config.title}
                        </p>
                        <p className="text-xs text-[var(--color-gray-main)]">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ToggleSwitch
                        enabled={pref.inAppEnabled}
                        onChange={(value) =>
                          handleToggle(config.type, "inAppEnabled", value)
                        }
                        label={`${config.title} in-app notifications`}
                      />
                      <ToggleSwitch
                        enabled={pref.emailEnabled}
                        onChange={(value) =>
                          handleToggle(config.type, "emailEnabled", value)
                        }
                        label={`${config.title} email notifications`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
