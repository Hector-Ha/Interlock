"use client";

import { useState } from "react";
import { User, Lock, Bell, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSettings } from "@/components/features/settings/ProfileSettings";
import { SecuritySettings } from "@/components/features/settings/SecuritySettings";
import { NotificationSettings } from "@/components/features/settings/NotificationSettings";
import { BankSettings } from "@/components/features/settings/BankSettings";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "banks", label: "Connected Banks", icon: Building2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-content-primary">Settings</h1>
        <p className="text-content-secondary">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Navigation */}
        <nav className="lg:w-64 flex-shrink-0">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id} className="flex-shrink-0">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-brand-surface text-brand-text"
                        : "text-content-secondary hover:bg-background-tertiary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "banks" && <BankSettings />}
        </div>
      </div>
    </div>
  );
}
