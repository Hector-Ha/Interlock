"use client";

import { Wallet, PiggyBank, CreditCard, Landmark } from "lucide-react";
import type { Account } from "@/types/bank";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface AccountCardProps {
  account: Account;
  bankId: string;
}

const accountTypeConfig: Record<
  string,
  { icon: React.ElementType; bgColor: string; iconColor: string }
> = {
  checking: {
    icon: Wallet,
    bgColor: "bg-[var(--color-brand-surface)]",
    iconColor: "text-[var(--color-brand-main)]",
  },
  savings: {
    icon: PiggyBank,
    bgColor: "bg-[var(--color-success-surface)]",
    iconColor: "text-[var(--color-success-main)]",
  },
  credit: {
    icon: CreditCard,
    bgColor: "bg-[var(--color-warning-surface)]",
    iconColor: "text-[var(--color-warning-main)]",
  },
  default: {
    icon: Landmark,
    bgColor: "bg-[var(--color-gray-surface)]",
    iconColor: "text-[var(--color-gray-main)]",
  },
};

function getAccountConfig(subtype: string | undefined, type: string | undefined) {
  const key = (subtype || type || "default").toLowerCase();
  return accountTypeConfig[key] || accountTypeConfig.default;
}

export function AccountCard({ account }: AccountCardProps) {
  const balance = account.balance.current || 0;
  const available = account.balance.available;
  const isPositive = balance >= 0;
  const config = getAccountConfig(account.subtype, account.type);
  const Icon = config.icon;

  return (
    <Card
      padding="none"
      className="hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
              config.bgColor
            )}
          >
            <Icon className={cn("h-5 w-5", config.iconColor)} aria-hidden="true" />
          </div>

          {/* Account Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm text-[var(--color-gray-text)] truncate">
                {account.name}
              </h3>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-gray-main)] bg-[var(--color-gray-surface)] px-1.5 py-0.5 rounded shrink-0">
                {account.subtype || account.type}
              </span>
            </div>
            <p className="text-xs text-[var(--color-gray-main)] font-mono">
              •••• {account.mask}
            </p>
          </div>

          {/* Balance */}
          <div className="text-right shrink-0">
            <p
              className={cn(
                "font-semibold tabular-nums",
                isPositive
                  ? "text-[var(--color-gray-text)]"
                  : "text-[var(--color-error-main)]"
              )}
            >
              {formatCurrency(balance)}
            </p>
            {available !== null && available !== undefined && (
              <p className="text-xs text-[var(--color-gray-main)] tabular-nums">
                {formatCurrency(available)} avail.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
