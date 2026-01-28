"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { formatDayTime, getCategoryBadgeVariant, cn, formatCategory } from "@/lib/utils";
import type { Transaction, Bank } from "@/types/bank";

interface RecentTransactionsProps {
  transactions: Transaction[];
  banks: Bank[];
  transactionsByBank?: Record<string, Transaction[]>;
}

// Helper function to get status badge styling
function getStatusBadge(status: Transaction["status"]) {
  switch (status) {
    case "SUCCESS":
      return {
        dotClass: "bg-success-main",
        textClass: "text-success-main",
        label: "Success",
      };
    case "PENDING":
      return {
        dotClass: "bg-warning-main",
        textClass: "text-warning-main",
        label: "Pending",
      };
    case "PROCESSING":
      return {
        dotClass: "bg-gray-main",
        textClass: "text-gray-main",
        label: "Processing",
      };
    case "FAILED":
    case "DECLINED":
    case "RETURNED":
      return {
        dotClass: "bg-error-main",
        textClass: "text-error-main",
        label: status.charAt(0) + status.slice(1).toLowerCase(),
      };
    case "CANCELLED":
    default:
      return {
        dotClass: "bg-gray-main",
        textClass: "text-gray-main",
        label: "Cancelled",
      };
  }
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RecentTransactions({
  transactions,
  banks,
  transactionsByBank = {},
}: RecentTransactionsProps) {
  const [selectedBankId, setSelectedBankId] = useState<string>(
    banks[0]?.id || "",
  );

  const selectedBank = banks.find((b) => b.id === selectedBankId);
  const displayTransactions =
    transactionsByBank[selectedBankId] || transactions;

  return (
    <Card className="rounded-xl shadow-sm border border-gray-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-soft">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Recent transactions
        </h2>
        <Link
          href="/transfers"
          className="inline-flex items-center justify-center px-3 h-9 rounded-md text-sm font-medium border border-input bg-background hover:bg-gray-surface hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Bank Tabs */}
      {banks.length > 0 && (
        <div className="px-4 sm:px-6">
          <Tabs
            value={selectedBankId}
            onValueChange={setSelectedBankId}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap">
              {banks.map((bank) => (
                <TabsTrigger
                  key={bank.id}
                  value={bank.id}
                  className="whitespace-nowrap text-sm"
                >
                  {bank.institutionName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Selected Bank Card */}
      {selectedBank && (
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-brand-main">
                <AvatarFallback className="bg-brand-main text-white text-sm font-semibold">
                  {getInitials(selectedBank.institutionName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedBank.institutionName}
                </p>
                <p className="text-sm text-brand-main font-medium">
                  {/* Balance would come from account data */}
                  {selectedBank.accounts?.[0]?.balance?.current != null
                    ? `$${selectedBank.accounts[0].balance.current.toFixed(2)}`
                    : ""}
                </p>
              </div>
            </div>
            <span className="text-xs text-success-main font-medium">
              {selectedBank.accounts?.[0]?.subtype || "checking"}
            </span>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      {displayTransactions.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No recent transactions.
        </div>
      ) : (
        <>
          {/* Mobile List View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {displayTransactions.map((tx) => {
              const isDebit = tx.amount < 0;
              const amount = isDebit
                ? `-$${Math.abs(tx.amount).toFixed(2)}`
                : `+$${tx.amount.toFixed(2)}`;
              const statusConfig = getStatusBadge(tx.status);

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback>{getInitials(tx.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate text-sm">
                        {tx.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            statusConfig.dotClass,
                          )}
                        />
                        <span className={cn("text-xs", statusConfig.textClass)}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={cn(
                        "font-semibold text-sm tabular-nums",
                        isDebit ? "text-error-main" : "text-success-main",
                      )}
                    >
                      {amount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDayTime(tx.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="py-3 pl-6 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Transaction
                  </TableHead>
                  <TableHead className="py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Amount
                  </TableHead>
                  <TableHead className="py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Status
                  </TableHead>
                  <TableHead className="py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Date
                  </TableHead>
                  <TableHead className="py-3 pr-6 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Category
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTransactions.map((tx) => {
                  const isDebit = tx.amount < 0;
                  const amount = isDebit
                    ? `-$${Math.abs(tx.amount).toFixed(2)}`
                    : `+$${tx.amount.toFixed(2)}`;
                  const statusConfig = getStatusBadge(tx.status);
                  const category = Array.isArray(tx.category)
                    ? tx.category[0]
                    : tx.category || "Other";

                  return (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {getInitials(tx.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {tx.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-4 font-semibold tabular-nums",
                          isDebit ? "text-error-main" : "text-success-main",
                        )}
                      >
                        {amount}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              statusConfig.dotClass,
                            )}
                          />
                          <span
                            className={cn("text-sm", statusConfig.textClass)}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground text-sm">
                        {formatDayTime(tx.date)}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <Badge
                          variant={getCategoryBadgeVariant(category)}
                          className="text-xs"
                        >
                          {formatCategory(category)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>
  );
}
