"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  CreditCard,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import {
  cn,
  formatDate,
  formatCategory,
  getCategoryBadgeVariant,
} from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  name: string;
  merchantName: string | null;
  date: string;
  status: string;
  category: string | null;
  channel: string;
  pending: boolean;
  type?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  bankName?: string;
  isLoading?: boolean;
  error?: string | null;
  showBankHeader?: boolean;
  searchQuery?: string;
  totalOriginalCount?: number;
}

const TRANSACTIONS_PER_PAGE = 10;

function getStatusConfig(status: string) {
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
    case "FAILED":
    case "DECLINED":
    case "RETURNED":
      return {
        dotClass: "bg-error-main",
        textClass: "text-error-main",
        label: status.charAt(0) + status.slice(1).toLowerCase(),
      };
    default:
      return {
        dotClass: "bg-gray-main",
        textClass: "text-gray-main",
        label: status,
      };
  }
}

export function TransactionTable({
  transactions,
  bankName,
  isLoading,
  error,
  showBankHeader = false,
  searchQuery,
  totalOriginalCount,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-error-surface)] mb-4">
          <XCircle
            className="h-7 w-7 text-[var(--color-error-main)]"
            aria-hidden="true"
          />
        </div>
        <p className="font-medium text-[var(--color-gray-text)] mb-1">
          Failed to load transactions
        </p>
        <p className="text-sm text-[var(--color-error-main)]">
          {bankName ? `${bankName}: ` : ""}
          {error}
        </p>
      </div>
    );
  }

  if (transactions.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gray-surface)] mb-4">
          <Search
            className="h-8 w-8 text-[var(--color-gray-disabled)]"
            aria-hidden="true"
          />
        </div>
        <p className="font-medium text-[var(--color-gray-text)] mb-1">
          No transactions found
        </p>
        <p className="text-sm text-[var(--color-gray-main)]">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bank Header */}
      {showBankHeader && bankName && (
        <div className="flex items-center justify-between px-5 lg:px-6 py-3.5 bg-[var(--color-gray-surface)]/60 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-brand-surface)]">
              <CreditCard
                className="h-4 w-4 text-[var(--color-brand-main)]"
                aria-hidden="true"
              />
            </div>
            <span className="font-semibold text-[var(--color-gray-text)]">
              {bankName}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs tabular-nums">
            {totalOriginalCount ?? transactions.length} transactions
          </Badge>
        </div>
      )}

      {/* Results Info Bar */}
      {searchQuery && (
        <div className="px-5 lg:px-6 py-2 bg-[var(--color-gray-surface)] border-b border-[var(--color-gray-soft)]">
          <p className="text-xs text-[var(--color-gray-main)]">
            Showing {transactions.length} of{" "}
            {totalOriginalCount ?? transactions.length} transactions matching "
            {searchQuery}"
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/40">
              <th className="px-5 lg:px-6 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider w-48 lg:w-64">
                Transaction
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden md:table-cell whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden sm:table-cell whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden lg:table-cell whitespace-nowrap">
                Status
              </th>
              <th className="px-5 lg:px-6 py-3 text-right text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-gray-soft)]">
            {paginatedTransactions.map((tx) => {
              const isDebit = tx.amount < 0;
              const category = tx.category || "Other";
              const statusConfig = getStatusConfig(tx.status);

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-[var(--color-gray-surface)]/50 transition-colors"
                >
                  {/* Transaction Name + Icon */}
                  <td className="px-5 lg:px-6 py-4 w-48 lg:w-64 max-w-48 lg:max-w-64">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                          isDebit
                            ? "bg-[var(--color-error-surface)]"
                            : "bg-[var(--color-success-surface)]",
                        )}
                      >
                        {isDebit ? (
                          <ArrowUpRight
                            className="h-5 w-5 text-[var(--color-error-main)]"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowDownLeft
                            className="h-5 w-5 text-[var(--color-success-main)]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="font-medium text-[var(--color-gray-text)] truncate">
                          {tx.name}
                        </p>
                        {tx.merchantName && tx.merchantName !== tx.name && (
                          <p className="text-xs text-[var(--color-gray-main)] truncate mt-0.5">
                            {tx.merchantName}
                          </p>
                        )}
                        {/* Mobile: Show date inline */}
                        <p className="text-xs text-[var(--color-gray-main)] mt-1 md:hidden tabular-nums">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 hidden md:table-cell whitespace-nowrap">
                    <span className="text-sm text-[var(--color-gray-main)] tabular-nums">
                      {formatDate(tx.date)}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 hidden sm:table-cell whitespace-nowrap">
                    <Badge
                      variant={getCategoryBadgeVariant(category)}
                      className="text-xs"
                    >
                      {formatCategory(category)}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 hidden lg:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          statusConfig.dotClass,
                        )}
                        aria-hidden="true"
                      />
                      <span className={cn("text-sm", statusConfig.textClass)}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 lg:px-6 py-4 text-right whitespace-nowrap">
                    <span
                      className={cn(
                        "text-base font-semibold tabular-nums",
                        isDebit
                          ? "text-[var(--color-error-main)]"
                          : "text-[var(--color-success-main)]",
                      )}
                    >
                      {isDebit ? "-" : "+"}$
                      {Math.abs(tx.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 lg:px-6 py-4 border-t border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
          <p className="text-sm text-[var(--color-gray-main)] tabular-nums">
            Showing {startIndex + 1}–
            {Math.min(startIndex + TRANSACTIONS_PER_PAGE, transactions.length)}{" "}
            of {transactions.length}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Single page footer */}
      {totalPages === 1 && transactions.length > 0 && (
        <div className="px-5 lg:px-6 py-3 border-t border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
          <p className="text-sm text-[var(--color-gray-main)] text-center tabular-nums">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
