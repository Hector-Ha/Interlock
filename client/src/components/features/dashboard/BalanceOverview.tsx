"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { useState } from "react";
import CountUp from "react-countup";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import type { Account } from "@/types/bank";

interface BalanceOverviewProps {
  totalBalance: number;
  balanceChange?: number;
  accounts: Account[];
  totalBanks: number;
  onAddBank: () => void;
}

export function BalanceOverview({
  totalBalance,
  balanceChange = 0,
  accounts,
  totalBanks,
  onAddBank,
}: BalanceOverviewProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const maxBalance = Math.max(
    ...accounts.map((a) => a.balance.current || 0),
    1,
  );

  const isPositive = balanceChange >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingUp; // Keep TrendingUp but rotate for down? Or import TrendingDown.

  return (
    <Card
      padding="none"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
    >
      {/* Security Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="security-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 16h32M16 0v32"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#security-grid)" />
        </svg>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-brand-main)] rounded-full blur-[100px] opacity-20" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--color-success-main)] rounded-full blur-[120px] opacity-10" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-[var(--color-success-main)]" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Total Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-success-main)] font-semibold">
                  Secured
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-main)] animate-pulse" />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          >
            {isBalanceVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Balance Display */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight tabular-nums">
              {isBalanceVisible ? (
                <>
                  <span className="text-white/60">$</span>
                  <CountUp
                    duration={2}
                    decimals={2}
                    decimal="."
                    separator=","
                    end={totalBalance}
                  />
                </>
              ) : (
                <div className="flex items-center">
                  <span className="tracking-widest text-white/60">$</span>
                  <span className="tracking-widest">••••••</span>
                </div>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div
              className={cn(
                "flex items-center gap-1.5",
                isPositive
                  ? "text-[var(--color-success-main)]"
                  : "text-[var(--color-error-main)]",
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? "+" : ""}
                {balanceChange.toFixed(1)}%
              </span>
            </div>
            <span className="text-white/40 text-sm">vs last month</span>
          </div>
        </div>

        {/* Account Breakdown */}
        {accounts.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-white/40 text-xs uppercase tracking-wider font-medium">
              Account Distribution
            </p>
            <div className="grid gap-2">
              {accounts.slice(0, 3).map((account) => {
                const balance = account.balance.current || 0;
                const percentage = (balance / maxBalance) * 100;
                return (
                  <div key={account.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 text-sm truncate max-w-[180px]">
                        {account.name}
                      </span>
                      <span className="text-white font-medium text-sm tabular-nums">
                        $
                        {balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--color-brand-main)] to-[var(--color-brand-disabled)] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {accounts.length > 3 && (
                <Link
                  href="/banks"
                  className="text-right text-xs text-white/40 font-medium mt-1 hover:underline hover:text-white block ml-auto w-fit cursor-pointer transition-colors"
                >
                  +{accounts.length - 3} more
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-white/40 text-sm">
            {totalBanks} bank{totalBanks !== 1 ? "s" : ""} connected
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 hover:text-white gap-1.5"
            onClick={onAddBank}
          >
            <Plus className="w-4 h-4" />
            Add Bank
          </Button>
        </div>
      </div>
    </Card>
  );
}
