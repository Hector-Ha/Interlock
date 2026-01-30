"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { cn, formatDayTime, getCategoryBadgeVariant, formatCategory } from "@/lib/utils";
import type { Transaction, Bank } from "@/types/bank";

interface TransactionsCardProps {
  transactions: Transaction[];
  banks: Bank[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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

export function TransactionsCard({
  transactions,
  banks,
}: TransactionsCardProps) {
  const [selectedBankId, setSelectedBankId] = useState<string>("all");

  const filteredTransactions =
    selectedBankId === "all"
      ? transactions.slice(0, 10) // Show 10 most recent from all banks
      : transactions.filter((tx) => tx.bankId === selectedBankId).slice(0, 10);

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <CardHeader className="flex-row items-start sm:items-center justify-between p-3 sm:p-6 pb-2.5 sm:pb-4 gap-2 border-b border-[var(--color-gray-soft)]">
        <div className="min-w-0">
          <CardTitle className="text-base sm:text-xl font-semibold">
            Recent Transactions
          </CardTitle>
          <p className="text-xs text-[var(--color-gray-main)] mt-0.5 hidden sm:block">
            Track your spending and income
          </p>
        </div>
        <Link href="/transactions" className="shrink-0">
          <Button variant="outline" size="sm" className="gap-0.5 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-sm">
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </Link>
      </CardHeader>

      {/* Bank Filter Tabs */}
      {banks.length > 1 && (
        <div className="pt-2.5 sm:pt-4">
          <Tabs value={selectedBankId} onValueChange={setSelectedBankId}>
            <TabsList className="h-auto bg-transparent p-0 gap-1.5 sm:gap-3 justify-start overflow-x-auto overflow-y-hidden w-full no-scrollbar px-3 sm:px-6 pb-2.5 sm:pb-4">
              <TabsTrigger
                value="all"
                className="rounded-md border border-[var(--color-gray-soft)] px-2 sm:px-4 py-1 sm:py-2 text-[11px] sm:text-sm font-medium text-[var(--color-gray-text)] bg-white 
                hover:border-[var(--color-primary)] transition-all hover:text-[var(--color-primary)] hover:bg-primary/10
                data-[state=active]:bg-[var(--color-brand-main)] data-[state=active]:border-[var(--color-brand-main)] 
                data-[state=active]:text-white shadow-sm shrink-0"
              >
                All
              </TabsTrigger>
              {banks.map((bank) => (
                <TabsTrigger
                  key={bank.id}
                  value={bank.id}
                  className="rounded-md border border-[var(--color-gray-soft)] px-2 sm:px-4 py-1 sm:py-2 text-[11px] sm:text-sm font-medium text-[var(--color-gray-text)] bg-white 
                  hover:border-[var(--color-primary)] transition-all hover:text-[var(--color-primary)] hover:bg-primary/10
                  data-[state=active]:bg-[var(--color-brand-main)] data-[state=active]:border-[var(--color-brand-main)] 
                  data-[state=active]:text-white shadow-sm whitespace-nowrap shrink-0"
                >
                  {bank.institutionName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Transactions List */}
      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-gray-surface)] flex items-center justify-center mb-3 sm:mb-4">
              <Search className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--color-gray-disabled)]" />
            </div>
            <p className="text-[var(--color-gray-text)] font-medium mb-0.5 sm:mb-1 text-sm sm:text-base">
              No transactions yet
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-gray-main)]">
              Your transactions will appear here once you start using your
              accounts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-gray-soft)]">
            {filteredTransactions.slice(0, 8).map((tx) => {
              const isDebit = tx.amount < 0;
              const statusConfig = getStatusConfig(tx.status);
              const category = Array.isArray(tx.category)
                ? tx.category[0]
                : tx.category || "Other";

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-4 hover:bg-[var(--color-gray-surface)]/50 transition-colors cursor-pointer"
                >
                  {/* Transaction Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl shrink-0",
                      isDebit
                        ? "bg-[var(--color-error-surface)]"
                        : "bg-[var(--color-success-surface)]",
                    )}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[var(--color-error-main)]" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[var(--color-success-main)]" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-base text-[var(--color-gray-text)] truncate">
                      {tx.name}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-min sm:text-[10px] px-1 sm:px-1.5 py-0 h-3.5 sm:h-5 gap-0.5 border-0",
                          statusConfig.bg,
                          statusConfig.text,
                        )}
                      >
                        <span
                          className={cn(
                            "w-1 h-1 rounded-full",
                            statusConfig.dot,
                          )}
                        />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-min sm:text-xs text-[var(--color-gray-main)]">
                        {formatDayTime(tx.date)}
                      </span>
                    </div>
                  </div>

                  {/* Amount & Category */}
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span
                      className={cn(
                        "font-semibold tabular-nums text-xs sm:text-base",
                        isDebit
                          ? "text-[var(--color-error-main)]"
                          : "text-[var(--color-success-main)]",
                      )}
                    >
                      {isDebit ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                    <Badge
                      variant={getCategoryBadgeVariant(category)}
                      className="text-min sm:text-[10px] px-1 sm:px-2 py-0 hidden sm:flex"
                    >
                      {formatCategory(category)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
