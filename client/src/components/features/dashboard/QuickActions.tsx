"use client";

import Link from "next/link";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface QuickActionsProps {
  hasBanks: boolean;
}

export function QuickActions({ hasBanks }: QuickActionsProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
        <Link href="/banks" className="contents">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-4 sm:px-6 min-h-[80px] sm:min-w-[120px]"
          >
            <Plus className="h-6 w-6 text-brand-main" />
            <span className="text-sm font-medium">Add Bank</span>
          </Button>
        </Link>
        <Link href="/transfers/new" className="contents">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-4 sm:px-6 min-h-[80px] sm:min-w-[120px]"
            disabled={!hasBanks}
          >
            <Send className="h-6 w-6 text-success-main" />
            <span className="text-sm font-medium">Transfer</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
