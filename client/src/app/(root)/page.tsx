"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Send, ArrowLeftRight, Building2, Sparkles } from "lucide-react";
import { RefreshButton } from "@/components/shared/RefreshButton";
import { useAuthStore } from "@/stores/auth.store";
import { useBankStore } from "@/stores/bank.store";
import { useDashboard } from "@/hooks/useDashboard";
import { useRefresh } from "@/hooks/useRefresh";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { TotalBalanceCard } from "@/components/features/dashboard/TotalBalanceCard";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AddBankModal } from "@/components/features/banks/AddBankModal";

interface QuickActionItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  iconBgClass: string;
  iconColorClass: string;
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

  const actions: QuickActionItem[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Add Bank",
      description: "Connect a new bank account",
      onClick: () => setIsAddBankOpen(true),
      iconBgClass: "bg-brand-surface",
      iconColorClass: "text-brand-main",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send Money",
      description: "Transfer to anyone instantly",
      href: "/transfers?type=p2p",
      disabled: banks.length === 0,
      iconBgClass: "bg-success-surface",
      iconColorClass: "text-success-main",
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: "Transfer Funds",
      description: "Move money between accounts",
      href: "/transfers",
      disabled: banks.length === 0,
      iconBgClass: "bg-warning-surface",
      iconColorClass: "text-warning-main",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "My Banks",
      description: "View all connected banks",
      href: "/banks",
      iconBgClass: "bg-gray-surface",
      iconColorClass: "text-gray-main",
    },
  ];

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

  return (
    <section className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Section */}
        <header className="flex items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {greeting}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              {user?.firstName || "Guest"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {formatLastUpdated()}
            </span>
            <RefreshButton isRefreshing={isRefreshing} onClick={refresh} />
          </div>
        </header>

        {banks.length === 0 ? (
          /* Empty State */
          <Card className="p-8 sm:p-12 text-center border-2 border-dashed border-brand-disabled/50 rounded-2xl bg-gradient-to-br from-brand-surface/50 via-transparent to-success-surface/20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-main to-brand-hover flex items-center justify-center mb-6 shadow-lg shadow-brand-main/25">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Welcome to Interlock
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Connect your first bank account to start tracking your finances
              and managing transactions securely.
            </p>
            <Button
              onClick={() => setIsAddBankOpen(true)}
              className="bg-brand-main hover:bg-brand-hover text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Your First Bank
            </Button>
          </Card>
        ) : (
          /* Main Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Balance Card + Recent Transactions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <TotalBalanceCard
                totalCurrentBalance={totalBalance}
                accounts={accounts}
                totalBanks={banks.length}
              />

              {/* Recent Transactions */}
              <RecentTransactions
                transactions={recentTransactions}
                banks={banks}
              />
            </div>

            {/* Right Column - Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-brand-main" />
                  <h2 className="text-base font-semibold text-foreground">
                    Quick Actions
                  </h2>
                </div>
                {/* Mobile: Grid, Desktop: Stack */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {actions.map((action) => {
                    const content = (
                      <Card
                        className={`group flex items-center gap-4 p-4 rounded-xl border border-border/50
                          hover:border-brand-disabled hover:shadow-md hover:shadow-brand-surface/50
                          active:scale-[0.98] transition-all duration-200
                          ${action.disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                      >
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-xl shrink-0 
                            ${action.iconBgClass} group-hover:scale-105 transition-transform duration-200`}
                        >
                          <span className={action.iconColorClass}>
                            {action.icon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm group-hover:text-brand-main transition-colors">
                            {action.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {action.description}
                          </p>
                        </div>
                      </Card>
                    );

                    if (action.onClick) {
                      return (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          className="text-left w-full"
                          type="button"
                        >
                          {content}
                        </button>
                      );
                    }

                    return (
                      <Link key={action.label} href={action.href || "#"}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </section>
  );
}
