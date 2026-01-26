"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface TransactionsHeaderProps {
  totalIncome: number;
  totalExpense: number;
}

export function TransactionsHeader({
  totalIncome,
  totalExpense,
}: TransactionsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
          Transactions
        </h1>
        <p className="text-[var(--color-gray-main)]">
          View and analyze your transaction history across all banks
        </p>
      </div>

      {/* Stats Cards - 2 columns equal width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-success-soft)]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-success-main)] rounded-full blur-[40px] opacity-10" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-success-surface)]">
              <TrendingUp className="h-6 w-6 text-[var(--color-success-main)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider font-medium">
                Total Income
              </p>
              <p className="text-xl font-bold text-[var(--color-success-main)] tabular-nums mt-0.5">
                +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-error-soft)]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-error-main)] rounded-full blur-[40px] opacity-10" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-error-surface)]">
              <TrendingDown className="h-6 w-6 text-[var(--color-error-main)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider font-medium">
                Total Expenses
              </p>
              <p className="text-xl font-bold text-[var(--color-error-main)] tabular-nums mt-0.5">
                -${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
