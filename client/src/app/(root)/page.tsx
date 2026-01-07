"use client";

import React from "react";
import HeaderBox from "@/components/shared/HeaderBox";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { useDashboard } from "@/hooks/useDashboard";
import { BanksList } from "@/components/features/dashboard/BanksList";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { QuickActions } from "@/components/features/dashboard/QuickActions";
import { TotalBalanceCard } from "@/components/features/dashboard/TotalBalanceCard";
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
  } = useDashboard();

  if (isLoading) {
    return (
      <section className="home">
        <div className="home-content">
          <DashboardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="home">
        <div className="home-content">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-12">
        <header className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="w-full md:max-w-xl">
            <HeaderBox
              type="greeting"
              title={greeting}
              user={user?.firstName || "Guest"}
              subtext="Access and manage your account and transactions efficiently."
            />
          </div>

          <div className="w-full md:max-w-[400px]">
            <TotalBalanceCard
              totalCurrentBalance={totalBalance}
              accounts={accounts}
              totalBanks={banks.length}
            />
          </div>
        </header>

        <QuickActions hasBanks={banks.length > 0} />

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">My Banks</h3>
            <BanksList banks={banks} />
          </div>

          <div className="space-y-6">
            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
