"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transfer } from "@/types/transfer";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferRowProps {
  transfer: Transfer;
  onClick?: () => void;
}

function getStatusConfig(status: Transfer["status"]) {
  switch (status) {
    case "SUCCESS":
      return {
        icon: CheckCircle2,
        bg: "bg-[var(--color-success-surface)]",
        text: "text-[var(--color-success-main)]",
        badge: "success" as const,
      };
    case "PENDING":
      return {
        icon: Clock,
        bg: "bg-[var(--color-warning-surface)]",
        text: "text-[var(--color-warning-main)]",
        badge: "warning" as const,
      };
    case "FAILED":
    case "RETURNED":
      return {
        icon: XCircle,
        bg: "bg-[var(--color-error-surface)]",
        text: "text-[var(--color-error-main)]",
        badge: "destructive" as const,
      };
    default:
      return {
        icon: Clock,
        bg: "bg-[var(--color-gray-surface)]",
        text: "text-[var(--color-gray-main)]",
        badge: "secondary" as const,
      };
  }
}

export function TransferRow({ transfer, onClick }: TransferRowProps) {
  const statusConfig = getStatusConfig(transfer.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 sm:p-5",
        "hover:bg-[var(--color-gray-surface)]/50 transition-all duration-200",
        "cursor-pointer border-b border-[var(--color-gray-soft)] last:border-b-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-inset",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Status Icon */}
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105",
            statusConfig.bg,
          )}
        >
          <StatusIcon className={cn("h-5 w-5", statusConfig.text)} />
        </div>

        {/* Transfer Details */}
        <div className="min-w-0 flex-1 grid gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--color-gray-text)] truncate group-hover:text-[var(--color-brand-main)] transition-colors">
              {transfer.type === "DEBIT"
                ? `Transfer to ${transfer.destinationBankName}`
                : transfer.type === "P2P_SENT"
                  ? `Sent to ${transfer.destinationBankName}`
                  : `Received from ${transfer.destinationBankName}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-main)] truncate">
            {transfer.type === "DEBIT" && (
              <span>From {transfer.sourceBankName}</span>
            )}
            {transfer.type !== "DEBIT" && (
              <span>Via {transfer.sourceBankName}</span>
            )}
            <span className="text-[var(--color-gray-disabled)]">•</span>
            <span>{formatDate(transfer.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Amount & Status */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "font-semibold tabular-nums text-sm sm:text-base",
              transfer.type === "P2P_RECEIVED"
                ? "text-[var(--color-success-main)]"
                : "text-[var(--color-error-main)]",
            )}
          >
            {transfer.type === "P2P_RECEIVED" ? "+" : "-"}
            {formatCurrency(Math.abs(transfer.amount))}
          </span>
          <Badge
            variant={statusConfig.badge}
            className="text-[10px] h-5 px-2 py-0 w-fit"
          >
            {transfer.status}
          </Badge>
        </div>
        <ChevronRight className="h-4 w-4 text-[var(--color-gray-disabled)] group-hover:text-[var(--color-brand-main)] group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
