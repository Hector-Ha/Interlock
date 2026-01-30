"use client";

import { useState } from "react";
import {
  Plus,
  Send,
  ArrowLeftRight,
  Building2,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { useDashboard } from "@/hooks/useDashboard";
import { useRefresh } from "@/hooks/useRefresh";
import { BalanceOverview } from "@/components/features/dashboard/BalanceOverview";
import { QuickActionCard } from "@/components/features/dashboard/QuickActionCard";
import { TransactionsCard } from "@/components/features/dashboard/TransactionsCard";
import { WelcomeEmptyState } from "@/components/features/dashboard/WelcomeEmptyState";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";

import { AddBankModal } from "@/components/features/banks/AddBankModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"; // Add imports

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description?: string; // Optional
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant: "brand" | "success" | "warning" | "default";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { banks } = useBankStore();
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  const {
    isLoading,
    error,
    totalBalance,
    balanceChange,
    recentTransactions,
    accounts,
    greeting,
    refresh: refreshDashboard,
  } = useDashboard();

  const { isRefreshing, refresh, lastRefresh } = useRefresh(refreshDashboard);

  const hasBanks = banks.length > 0;

  const quickActions: QuickAction[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Add Bank",
      onClick: () => setIsAddBankOpen(true),
      variant: "brand",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      href: "/transfers?type=p2p",
      disabled: !hasBanks,
      variant: "success",
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: "Transfer Funds",
      href: "/transfers",
      disabled: !hasBanks,
      variant: "warning",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "My Banks",
      href: "/banks",
      variant: "default",
    },
  ];

  const formatLastUpdated = () => {
    if (!lastRefresh) return "Just now";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastRefresh.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--color-gray-surface)] overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 w-full">
          <DashboardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[var(--color-gray-surface)] overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 w-full">
          <div className="rounded-lg bg-[var(--color-error-surface)] p-3 sm:p-4 border border-[var(--color-error-border)] flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-error-main)] mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <h3 className="text-xs sm:text-sm font-semibold text-[var(--color-error-text)]">
                Error
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[var(--color-error-text)] leading-5">
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)] overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 w-full">
        {/* Header Section */}
        <header className="flex items-start justify-between gap-2 mb-4 sm:mb-8">
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-sm font-medium text-[var(--color-gray-main)]">
              {greeting}
            </p>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)] truncate">
              {user?.firstName || "Guest"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-min sm:text-xs text-[var(--color-gray-main)] whitespace-nowrap">
              {formatLastUpdated()}
            </span>
            <RefreshButton isRefreshing={isRefreshing} onClick={refresh} />
          </div>
        </header>

        {!hasBanks ? (
          <WelcomeEmptyState
            userName={user?.firstName || "there"}
            onAddBank={() => setIsAddBankOpen(true)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-8">
            {/* Balance Overview */}
            <BalanceOverview
              totalBalance={totalBalance}
              balanceChange={balanceChange}
              accounts={accounts}
              totalBanks={banks.length}
              onAddBank={() => setIsAddBankOpen(true)}
            />

            {/* Quick Actions Section */}
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between p-3 sm:p-6 pb-2.5 sm:pb-4 border-b border-[var(--color-gray-soft)]">
                <div>
                  <CardTitle className="text-base sm:text-xl font-semibold">
                    Quick Actions
                  </CardTitle>
                  <p className="text-xs text-[var(--color-gray-main)] mt-0.5 hidden sm:block">
                    Common tasks and shortcuts
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {quickActions.map((action) => (
                    <QuickActionCard
                      key={action.label}
                      icon={action.icon}
                      label={action.label}
                      href={action.href}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      variant={action.variant}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <TransactionsCard transactions={recentTransactions} banks={banks} />
          </div>
        )}
      </div>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </section>
  );
}
