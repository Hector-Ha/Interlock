"use client";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  CreditCard,
  ShoppingBag,
  Utensils,
  Car,
  Tv,
  Briefcase,
  Heart,
  Gift,
  Home,
  PiggyBank,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { cn, formatDate, formatCategory } from "@/lib/utils";

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
}

interface TransactionTableProps {
  transactions: Transaction[];
  bankName?: string;
  isLoading?: boolean;
  error?: string | null;
  showBankHeader?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Food and Drink": <Utensils className="h-4 w-4" />,
  Travel: <Car className="h-4 w-4" />,
  Shops: <ShoppingBag className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Transfer: <CreditCard className="h-4 w-4" />,
  Payment: <CreditCard className="h-4 w-4" />,
  Recreation: <Tv className="h-4 w-4" />,
  Entertainment: <Tv className="h-4 w-4" />,
  Service: <Briefcase className="h-4 w-4" />,
  Healthcare: <Heart className="h-4 w-4" />,
  Community: <Gift className="h-4 w-4" />,
  "Bank Fees": <Home className="h-4 w-4" />,
  Interest: <PiggyBank className="h-4 w-4" />,
  Tax: <Briefcase className="h-4 w-4" />,
};

function getCategoryIcon(category: string): React.ReactNode {
  if (categoryIcons[category]) return categoryIcons[category];
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return <CreditCard className="h-4 w-4" />;
}

function getStatusConfig(status: string) {
  switch (status) {
    case "SUCCESS":
      return { variant: "success" as const, label: "Success" };
    case "PENDING":
      return { variant: "warning" as const, label: "Pending" };
    case "FAILED":
    case "DECLINED":
    case "RETURNED":
      return { variant: "destructive" as const, label: status };
    default:
      return { variant: "secondary" as const, label: status };
  }
}

export function TransactionTable({
  transactions,
  bankName,
  isLoading,
  error,
  showBankHeader = false,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-[var(--color-error-main)]">
          {bankName ? `Failed to load ${bankName}: ` : ""}{error}
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gray-surface)] mb-4">
          <Search className="h-8 w-8 text-[var(--color-gray-disabled)]" />
        </div>
        <p className="font-medium text-[var(--color-gray-text)] mb-1">No transactions found</p>
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
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-gray-surface)]/50 border-b border-[var(--color-gray-soft)]">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[var(--color-brand-main)]" />
            <span className="font-semibold text-[var(--color-gray-text)]">{bankName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {transactions.length} transactions
          </Badge>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden md:table-cell">
                Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider hidden lg:table-cell">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--color-gray-main)] uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-gray-soft)]">
            {transactions.slice(0, 25).map((tx) => {
              const isDebit = tx.amount > 0;
              const statusConfig = getStatusConfig(tx.status);
              const category = tx.category || "Other";

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-[var(--color-gray-surface)]/50 transition-colors"
                >
                  {/* Transaction Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                          isDebit
                            ? "bg-[var(--color-error-surface)]"
                            : "bg-[var(--color-success-surface)]"
                        )}
                      >
                        {isDebit ? (
                          <ArrowUpRight className="h-5 w-5 text-[var(--color-error-main)]" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-[var(--color-success-main)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--color-gray-text)] truncate max-w-[200px]">
                          {tx.name}
                        </p>
                        {tx.merchantName && (
                          <p className="text-xs text-[var(--color-gray-main)] truncate max-w-[200px]">
                            {tx.merchantName}
                          </p>
                        )}
                        {/* Mobile: Show date and category inline */}
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span className="text-xs text-[var(--color-gray-main)]">
                            {formatDate(tx.date)}
                          </span>
                          <span className="text-[var(--color-gray-disabled)]">•</span>
                          <span className="text-xs text-[var(--color-gray-main)]">{formatCategory(category)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-gray-main)]">
                        {getCategoryIcon(category)}
                      </span>
                      <span className="text-sm text-[var(--color-gray-main)]">{formatCategory(category)}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-[var(--color-gray-main)]">
                      {formatDate(tx.date)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <Badge variant={statusConfig.variant} className="text-[10px]">
                      {statusConfig.label}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-right">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Show more indicator */}
        {transactions.length > 25 && (
          <div className="px-5 py-3 text-center text-sm text-[var(--color-gray-main)] border-t border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
            Showing 25 of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
}
