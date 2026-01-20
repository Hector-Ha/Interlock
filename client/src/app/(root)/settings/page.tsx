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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Navigation */}
        <nav className="lg:w-64 flex-shrink-0">
          <div className="bg-card border border-border/50 rounded-xl p-2 shadow-sm">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id} className="flex-shrink-0">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        activeTab === tab.id
                          ? "bg-brand-surface text-brand-main border-l-2 border-brand-main lg:border-l-2"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
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
