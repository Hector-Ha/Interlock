"use client";

import { ArrowRightLeft, Send, Shield, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshButton } from "@/components/shared/RefreshButton";

interface TransfersHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenFilters: () => void;
  pendingCount?: number;
}

export function TransfersHeader({
  onRefresh,
  isRefreshing,
  onOpenFilters,
  pendingCount = 0,
}: TransfersHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
            Transfers
          </h1>
          <p className="text-[var(--color-gray-main)]">
            Send money and manage your transfers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton onClick={onRefresh} isRefreshing={isRefreshing} />
          <Button
            variant="outline"
            onClick={onOpenFilters}
            className="border-[var(--color-gray-disabled)] hover:border-[var(--color-brand-disabled)] hover:bg-[var(--color-brand-surface)]/30 transition-all"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-brand-soft)]"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-brand-main)] rounded-full blur-[30px] opacity-10" />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-brand-surface)]">
              <ArrowRightLeft className="h-5 w-5 text-[var(--color-brand-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                Internal
              </p>
              <p className="text-sm font-semibold text-[var(--color-gray-text)]">
                Between Accounts
              </p>
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-success-soft)]"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-success-main)] rounded-full blur-[30px] opacity-10" />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-success-surface)]">
              <Send className="h-5 w-5 text-[var(--color-success-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                P2P
              </p>
              <p className="text-sm font-semibold text-[var(--color-gray-text)]">
                Send to Users
              </p>
            </div>
          </div>
        </Card>

        {pendingCount > 0 && (
          <Card
            padding="none"
            className="relative overflow-hidden p-4 border-[var(--color-warning-soft)]"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-warning-main)] rounded-full blur-[30px] opacity-10" />
            <div className="relative flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-warning-surface)]">
                <Clock className="h-5 w-5 text-[var(--color-warning-main)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                  Pending
                </p>
                <p className="text-lg font-bold text-[var(--color-gray-text)] tabular-nums">
                  {pendingCount}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-gray-soft)] col-span-2 lg:col-span-1"
        >
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-gray-surface)]">
              <Shield className="h-5 w-5 text-[var(--color-success-main)]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[var(--color-gray-text)]">
                  Secure
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-main)] animate-pulse" />
              </div>
              <p className="text-xs text-[var(--color-gray-main)]">
                Encrypted transfers
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
