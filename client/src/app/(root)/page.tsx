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
  const { isLoading, error, totalBalance, recentTransactions, greeting } =
    useDashboard();

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
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title={greeting}
            user={user?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceCard totalBalance={totalBalance} />
        </header>

        <QuickActions />

        <div className="recent-transactions">
          <BanksList banks={banks} />
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
