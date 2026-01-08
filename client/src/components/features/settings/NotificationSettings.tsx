"use client";

import { Bell, Info } from "lucide-react";
import { Card, Alert } from "@/components/ui";

export function NotificationSettings() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-info-surface">
          <Bell className="h-5 w-5 text-info-text" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-content-primary">
            Notification Preferences
          </h2>
          <p className="text-sm text-content-secondary">
            Control how you receive notifications
          </p>
        </div>
      </div>

      <Alert variant="info" icon={<Info className="h-4 w-4" />}>
        Notification preferences will be available when P2P transfers are
        enabled. You&apos;ll be able to control email and in-app notifications
        for transfers, payments, and security alerts.
      </Alert>
    </Card>
  );
}
