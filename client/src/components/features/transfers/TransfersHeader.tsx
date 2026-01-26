"use client";

import { Shield, Filter, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { cn } from "@/lib/utils";

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
  const hasPending = pendingCount > 0;

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
            <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Row - 2 cards taking equal space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Transfers Card */}
        <Card
          padding="none"
          className={cn(
            "relative overflow-hidden p-5 transition-colors",
            hasPending
              ? "border-[var(--color-warning-soft)]"
              : "border-[var(--color-success-soft)]"
          )}
        >
          <div
            className={cn(
              "absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-15",
              hasPending
                ? "bg-[var(--color-warning-main)]"
                : "bg-[var(--color-success-main)]"
            )}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  hasPending
                    ? "bg-[var(--color-warning-surface)]"
                    : "bg-[var(--color-success-surface)]"
                )}
              >
                {hasPending ? (
                  <Clock
                    className="h-6 w-6 text-[var(--color-warning-main)]"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCircle2
                    className="h-6 w-6 text-[var(--color-success-main)]"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider font-medium">
                  {hasPending ? "Pending Transfers" : "Transfer Status"}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-0.5",
                    hasPending
                      ? "text-[var(--color-warning-text)]"
                      : "text-[var(--color-success-text)]"
                  )}
                >
                  {hasPending
                    ? `${pendingCount} in progress`
                    : "All transfers complete"}
                </p>
              </div>
            </div>
            {hasPending && (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-warning-main)] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-warning-main)]" />
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Secure Card */}
        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-gray-soft)]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-brand-main)] rounded-full blur-[40px] opacity-10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-surface)]">
                <Shield
                  className="h-6 w-6 text-[var(--color-brand-main)]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider font-medium">
                  Security
                </p>
                <p className="text-lg font-semibold text-[var(--color-gray-text)] mt-0.5">
                  Bank-Level Encryption
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success-main)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--color-success-text)]">
                Active
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
