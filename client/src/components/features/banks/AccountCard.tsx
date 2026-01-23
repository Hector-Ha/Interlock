"use client";

import { CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";
import type { Account } from "@/types/bank";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AccountCardProps {
  account: Account;
  bankId: string;
}

export function AccountCard({ account }: AccountCardProps) {
  const balance = account.balance.current || 0;
  const available = account.balance.available;
  const isPositive = balance >= 0;

  return (
    <Card
      padding="none"
      className="group relative overflow-hidden hover:shadow-lg hover:shadow-[var(--color-gray-main)]/5 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-surface)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-brand-surface)] group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="h-5 w-5 text-[var(--color-brand-main)]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--color-gray-text)] truncate group-hover:text-[var(--color-brand-main)] transition-colors">
                {account.name}
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                •••• {account.mask}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="capitalize text-[10px] px-2 border-[var(--color-gray-disabled)] text-[var(--color-gray-main)]"
          >
            {account.subtype || account.type}
          </Badge>
        </div>

        {/* Balance Section */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--color-gray-main)] uppercase tracking-wider mb-1">
              Current Balance
            </p>
            <div className="flex items-baseline gap-2">
              <p className={cn(
                "text-2xl font-bold tabular-nums",
                isPositive ? "text-[var(--color-gray-text)]" : "text-[var(--color-error-main)]"
              )}>
                {formatCurrency(balance)}
              </p>
              {isPositive && (
                <span className="flex items-center text-[var(--color-success-main)] text-xs font-medium">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  Active
                </span>
              )}
            </div>
          </div>

          {available !== null && available !== undefined && (
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-gray-soft)]">
              <span className="text-xs text-[var(--color-gray-main)]">Available</span>
              <span className="text-sm font-medium text-[var(--color-gray-text)] tabular-nums">
                {formatCurrency(available)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
