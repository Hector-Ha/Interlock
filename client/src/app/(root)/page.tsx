"use client";

import { useState } from "react";
import {
  Plus,
  Send,
  ArrowLeftRight,
  Building2,
  Sparkles,
  RefreshCw,
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { AddBankModal } from "@/components/features/banks/AddBankModal";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
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
      description: "Connect a new bank account",
      onClick: () => setIsAddBankOpen(true),
      variant: "brand",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      description: "Transfer to anyone instantly",
      href: "/transfers?type=p2p",
      disabled: !hasBanks,
      variant: "success",
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: "Transfer Funds",
      description: "Move money between accounts",
      href: "/transfers",
      disabled: !hasBanks,
      variant: "warning",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "My Banks",
      description: "View all connected banks",
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
      <section className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <DashboardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Section */}
        <header className="flex items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-gray-main)]">
              {greeting}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
              {user?.firstName || "Guest"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-gray-main)] hidden sm:inline">
              Updated {formatLastUpdated()}
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
          <div className="space-y-8">
            {/* Balance Overview */}
            <BalanceOverview
              totalBalance={totalBalance}
              accounts={accounts}
              totalBanks={banks.length}
              onAddBank={() => setIsAddBankOpen(true)}
            />

            {/* Quick Actions Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-[var(--color-brand-main)]" />
                <h2 className="text-sm font-semibold text-[var(--color-gray-text)] uppercase tracking-wide">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <QuickActionCard
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    description={action.description}
                    href={action.href}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    variant={action.variant}
                  />
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <TransactionsCard transactions={recentTransactions} banks={banks} />
          </div>
        )}
      </div>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </section>
  );
}
