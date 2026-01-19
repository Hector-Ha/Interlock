"use client";

import React from "react";
import HeaderBox from "@/components/shared/HeaderBox";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { useDashboard } from "@/hooks/useDashboard";
import { useRefresh } from "@/hooks/useRefresh";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { TotalBalanceCard } from "@/components/features/dashboard/TotalBalanceCard";
import { QuickActions } from "@/components/features/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { banks } = useBankStore();
  const {
    isLoading,
    error,
    totalBalance,
    recentTransactions,
    accounts,
    greeting,
    refresh: refreshDashboard,
  } = useDashboard();

  const { isRefreshing, refresh } = useRefresh(refreshDashboard);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <DashboardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Header Section */}
        <header className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <HeaderBox
              type="greeting"
              title={greeting}
              user={user?.firstName || "Guest"}
              subtext="Access & manage your account and transactions efficiently."
            />
            <RefreshButton isRefreshing={isRefreshing} onClick={refresh} />
          </div>

          {/* Balance Summary Card */}
          <TotalBalanceCard
            totalCurrentBalance={totalBalance}
            accounts={accounts}
            totalBanks={banks.length}
          />

          {/* Quick Actions */}
          <QuickActions hasBanks={banks.length > 0} />
        </header>

        {/* Recent Transactions Section */}
        <RecentTransactions transactions={recentTransactions} banks={banks} />
      </div>
    </section>
  );
};

export default DashboardPage;
