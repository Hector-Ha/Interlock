"use client";

import { useState } from "react";
import { User, Shield, Bell, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  },
  {
    id: "security",
    label: "Security",
    description: "Password & sessions",
    icon: Shield,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alert preferences",
    icon: Bell,
  },
  {
    id: "banks",
    label: "Connected Banks",
    description: "Linked accounts",
    icon: Building2,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
            Settings
          </h1>
          <p className="text-[var(--color-gray-main)] mt-1">
            Manage your account preferences and security
          </p>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8 bg-white rounded-xl border border-[var(--color-gray-soft)] p-2 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2",
                      isActive
                        ? "bg-[var(--color-brand-surface)]"
                        : "hover:bg-[var(--color-gray-surface)]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                        isActive
                          ? "bg-[var(--color-brand-main)]"
                          : "bg-[var(--color-gray-soft)]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px]",
                          isActive
                            ? "text-white"
                            : "text-[var(--color-gray-main)]"
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive
                            ? "text-[var(--color-gray-text)]"
                            : "text-[var(--color-gray-main)]"
                        )}
                      >
                        {tab.label}
                      </p>
                      <p className="text-xs text-[var(--color-gray-main)] truncate hidden lg:block">
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "banks" && <BankSettings />}
          </main>
        </div>
      </div>
    </section>
  );
}
