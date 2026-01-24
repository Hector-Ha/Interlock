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
import { cn, formatDayTime, getCategoryBadgeVariant } from "@/lib/utils";
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
      ? transactions
      : transactions.filter((tx) => tx.id.includes(selectedBankId));

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between p-5 sm:p-6 pb-4 border-b border-[var(--color-gray-soft)]">
        <div>
          <CardTitle className="text-xl font-semibold">
            Recent Transactions
          </CardTitle>
          <p className="text-sm text-[var(--color-gray-main)] mt-0.5">
            Track your spending and income
          </p>
        </div>
        <Link href="/transactions">
          <Button variant="outline" size="sm" className="gap-1.5">
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      {/* Bank Filter Tabs */}
      {banks.length > 1 && (
        <div className="pt-4">
          <Tabs value={selectedBankId} onValueChange={setSelectedBankId}>
            <TabsList className="h-auto bg-transparent p-0 gap-3 justify-start overflow-x-auto overflow-y-hidden w-full no-scrollbar px-6 pb-4">
              <TabsTrigger
                value="all"
                className="rounded-md border border-[var(--color-gray-soft)] px-4 py-2 text-sm font-medium text-[var(--color-gray-text)] bg-white 
                hover:border-[var(--color-primary)] transition-all hover:text-[var(--color-primary)] hover:bg-primary/10
                data-[state=active]:bg-[var(--color-brand-main)] data-[state=active]:border-[var(--color-brand-main)] 
                data-[state=active]:text-white shadow-sm"
              >
                All Banks
              </TabsTrigger>
              {banks.map((bank) => (
                <TabsTrigger
                  key={bank.id}
                  value={bank.id}
                  className="rounded-md border border-[var(--color-gray-soft)] px-4 py-2 text-sm font-medium text-[var(--color-gray-text)] bg-white 
                  hover:border-[var(--color-primary)] transition-all hover:text-[var(--color-primary)] hover:bg-primary/10
                  data-[state=active]:bg-[var(--color-brand-main)] data-[state=active]:border-[var(--color-brand-main)] 
                  data-[state=active]:text-white shadow-sm whitespace-nowrap"
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
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-gray-surface)] flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-[var(--color-gray-disabled)]" />
            </div>
            <p className="text-[var(--color-gray-text)] font-medium mb-1">
              No transactions yet
            </p>
            <p className="text-sm text-[var(--color-gray-main)]">
              Your transactions will appear here once you start using your
              accounts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-gray-soft)]">
            {filteredTransactions.slice(0, 8).map((tx) => {
              const isDebit = tx.amount > 0;
              const statusConfig = getStatusConfig(tx.status);
              const category = Array.isArray(tx.category)
                ? tx.category[0]
                : tx.category || "Other";

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-[var(--color-gray-surface)]/50 transition-colors cursor-pointer"
                >
                  {/* Transaction Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                      isDebit
                        ? "bg-[var(--color-error-surface)]"
                        : "bg-[var(--color-success-surface)]",
                    )}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="w-5 h-5 text-[var(--color-error-main)]" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-[var(--color-success-main)]" />
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
                          statusConfig.text,
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            statusConfig.dot,
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
                          : "text-[var(--color-success-main)]",
                      )}
                    >
                      {isDebit ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                    <Badge
                      variant={getCategoryBadgeVariant(category)}
                      className="text-[10px] px-2 py-0"
                    >
                      {category}
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
