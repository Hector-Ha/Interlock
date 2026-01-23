"use client";

import { useState } from "react";
import { User, Shield, Bell, Building2, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { ProfileSettings } from "@/components/features/settings/ProfileSettings";
import { SecuritySettings } from "@/components/features/settings/SecuritySettings";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { BankSettings } from "@/components/features/settings/BankSettings";

const TABS = [
  { 
    id: "profile", 
    label: "Profile", 
    description: "Personal info",
    icon: User,
    iconBg: "bg-[var(--color-brand-surface)]",
    iconColor: "text-[var(--color-brand-main)]",
    borderColor: "border-[var(--color-brand-soft)]",
  },
  { 
    id: "security", 
    label: "Security", 
    description: "Password & sessions",
    icon: Shield,
    iconBg: "bg-[var(--color-success-surface)]",
    iconColor: "text-[var(--color-success-main)]",
    borderColor: "border-[var(--color-success-soft)]",
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    description: "Alert preferences",
    icon: Bell,
    iconBg: "bg-[var(--color-warning-surface)]",
    iconColor: "text-[var(--color-warning-main)]",
    borderColor: "border-[var(--color-warning-soft)]",
  },
  { 
    id: "banks", 
    label: "Connected Banks", 
    description: "Linked accounts",
    icon: Building2,
    iconBg: "bg-[var(--color-gray-surface)]",
    iconColor: "text-[var(--color-gray-main)]",
    borderColor: "border-[var(--color-gray-soft)]",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const activeTabData = TABS.find((tab) => tab.id === activeTab);

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-brand-surface)]">
                <SettingsIcon className="h-5 w-5 text-[var(--color-brand-main)]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
                  Settings
                </h1>
                <p className="text-[var(--color-gray-main)]">
                  Manage your account preferences and security
                </p>
              </div>
            </div>

            {/* Tab Navigation Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2 rounded-xl"
                  >
                    <Card
                      padding="none"
                      className={cn(
                        "relative overflow-hidden p-4 transition-all duration-200",
                        isActive
                          ? `${tab.borderColor} border-2 shadow-md`
                          : "border-[var(--color-gray-soft)] hover:border-[var(--color-gray-disabled)] hover:shadow-sm"
                      )}
                    >
                      {isActive && (
                        <div
                          className={cn(
                            "absolute top-0 right-0 w-16 h-16 rounded-full blur-[30px] opacity-20",
                            tab.iconBg.replace("bg-", "bg-").replace("-surface", "-main")
                          )}
                          style={{
                            backgroundColor: `var(--color-${tab.id === "profile" ? "brand" : tab.id === "security" ? "success" : tab.id === "notifications" ? "warning" : "gray"}-main)`,
                          }}
                        />
                      )}
                      <div className="relative flex items-center gap-3">
                        <div
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                            tab.iconBg
                          )}
                        >
                          <Icon className={cn("h-5 w-5", tab.iconColor)} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm font-semibold truncate",
                              isActive
                                ? "text-[var(--color-gray-text)]"
                                : "text-[var(--color-gray-main)]"
                            )}
                          >
                            {tab.label}
                          </p>
                          <p className="text-xs text-[var(--color-gray-main)] truncate hidden sm:block">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-brand-main)] to-transparent" />
                      )}
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="min-w-0">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "banks" && <BankSettings />}
          </div>
        </div>
      </div>
    </section>
  );
}
