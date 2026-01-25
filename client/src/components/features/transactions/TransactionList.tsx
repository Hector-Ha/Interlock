"use client";

import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDayTime, getCategoryBadgeVariant, formatCategory } from "@/lib/utils";
import type { Transaction } from "@/services/bank.service";

interface TransactionListProps {
  transactions: Transaction[];
}

function getStatusConfig(status: Transaction["status"]) {
  const configs = {
    SUCCESS: {
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      label: "Success",
    },
    PENDING: {
      dot: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
      label: "Pending",
    },
    PROCESSING: {
      dot: "bg-blue-500",
      text: "text-blue-700",
      bg: "bg-blue-50",
      label: "Processing",
    },
    FAILED: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      label: "Failed",
    },
    DECLINED: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      label: "Declined",
    },
    RETURNED: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      label: "Returned",
    },
    CANCELLED: {
      dot: "bg-gray-500",
      text: "text-gray-700",
      bg: "bg-gray-50",
      label: "Cancelled",
    },
  };
  return configs[status] || configs.CANCELLED;
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gray-surface)] flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-[var(--color-gray-disabled)]" aria-hidden="true" />
        </div>
        <p className="text-[var(--color-gray-text)] font-medium mb-1">
          No transactions found
        </p>
        <p className="text-sm text-[var(--color-gray-main)]">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-gray-soft)]">
      {transactions.map((tx) => {
        const isDebit = tx.amount > 0;
        const statusConfig = getStatusConfig(tx.status);
        const category = Array.isArray(tx.category)
          ? tx.category[0]
          : tx.category || "Other";

        return (
          <div
            key={tx.id}
            className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-[var(--color-gray-surface)]/50 transition-colors"
          >
            {/* Transaction Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                isDebit
                  ? "bg-[var(--color-error-surface)]"
                  : "bg-[var(--color-success-surface)]"
              )}
            >
              {isDebit ? (
                <ArrowUpRight className="w-5 h-5 text-[var(--color-error-main)]" aria-hidden="true" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-[var(--color-success-main)]" aria-hidden="true" />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--color-gray-text)] truncate">
                {tx.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-5 gap-1 border-0",
                    statusConfig.bg,
                    statusConfig.text
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      statusConfig.dot
                    )}
                  />
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-[var(--color-gray-disabled)]">
                  •
                </span>
                <span className="text-xs text-[var(--color-gray-main)]">
                  {formatDayTime(tx.date)}
                </span>
              </div>
            </div>

            {/* Amount & Category */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  isDebit
                    ? "text-[var(--color-error-main)]"
                    : "text-[var(--color-success-main)]"
                )}
              >
                {isDebit ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
              </span>
              <Badge
                variant={getCategoryBadgeVariant(category)}
                className="text-[10px] px-2 py-0"
              >
                {formatCategory(category)}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
