"use client";

import { Bell } from "lucide-react";
import { Card, Alert } from "@/components/ui";

export function NotificationSettings() {
  return (
    <Card className="border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-info-surface">
          <Bell className="h-5 w-5 text-info-text" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Notification Preferences
          </h2>
          <p className="text-sm text-muted-foreground">
            Control how you receive notifications
          </p>
        </div>
      </div>

      <Alert variant="info">
        Notification preferences will be available when P2P transfers are
        enabled. You&apos;ll be able to control email and in-app notifications
        for transfers, payments, and security alerts.
      </Alert>
    </Card>
  );
}
