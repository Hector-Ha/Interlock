"use client";

import { Receipt, TrendingDown, TrendingUp, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface TransactionsHeaderProps {
  totalBanks: number;
  totalIncome: number;
  totalExpense: number;
}

export function TransactionsHeader({
  totalBanks,
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-brand-soft)]"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-brand-main)] rounded-full blur-[30px] opacity-10" />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-brand-surface)]">
              <Receipt className="h-5 w-5 text-[var(--color-brand-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                All Transactions
              </p>
              <p className="text-sm font-semibold text-[var(--color-gray-text)]">
                View History
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
              <TrendingUp className="h-5 w-5 text-[var(--color-success-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                Income
              </p>
              <p className="text-lg font-bold text-[var(--color-success-main)] tabular-nums">
                +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-error-soft)]"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-error-main)] rounded-full blur-[30px] opacity-10" />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-error-surface)]">
              <TrendingDown className="h-5 w-5 text-[var(--color-error-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                Expenses
              </p>
              <p className="text-lg font-bold text-[var(--color-error-main)] tabular-nums">
                -${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-4 border-[var(--color-gray-soft)]"
        >
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-gray-surface)]">
              <Building2 className="h-5 w-5 text-[var(--color-gray-main)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider">
                Banks
              </p>
              <p className="text-lg font-bold text-[var(--color-gray-text)] tabular-nums">
                {totalBanks}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
