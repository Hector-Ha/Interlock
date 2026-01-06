"use client";

import Link from "next/link";
import { Plus, Send, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface QuickActionsProps {
  hasBanks: boolean;
}

export function QuickActions({ hasBanks }: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-4">
        <Link href="/banks">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-6 min-w-[120px]"
          >
            <Plus className="h-6 w-6 text-[#7839EE]" />
            <span className="text-sm font-medium">Add Bank</span>
          </Button>
        </Link>
        <Link href="/transfers/new">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-6 min-w-[120px]"
            disabled={!hasBanks}
          >
            <Send className="h-6 w-6 text-emerald-500" />
            <span className="text-sm font-medium">Transfer</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
