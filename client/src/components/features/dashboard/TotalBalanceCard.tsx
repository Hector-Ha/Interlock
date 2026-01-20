"use client";

import { useState } from "react";
import CountUp from "react-countup";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AddBankModal } from "@/components/features/banks/AddBankModal";
import type { Account } from "@/types/bank";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TotalBalanceCardProps {
  totalCurrentBalance: number;
  accounts: Account[];
  totalBanks: number;
  className?: string;
}

export function TotalBalanceCard({
  totalCurrentBalance,
  accounts = [],
  totalBanks,
  className,
}: TotalBalanceCardProps) {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  const hasAccounts = accounts.length > 0;

  const chartData = hasAccounts
    ? {
        datasets: [
          {
            label: "Banks",
            data: accounts.map((a) => a.balance.current),
            backgroundColor: ["#7839ee", "#6d28d9", "#c4b5fd"],
          },
        ],
        labels: accounts.map((a) => a.name),
      }
    : {
        datasets: [
          {
            label: "No Connected Banks",
            data: [100],
            backgroundColor: ["#e9ecef"],
          },
        ],
        labels: ["No Banks connected"],
      };

  return (
    <div className={className}>
      <Card className="relative overflow-hidden rounded-xl shadow-sm border border-gray-soft bg-gradient-to-br from-brand-surface/50 to-transparent">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative flex items-center gap-6 p-6 sm:p-8">
          {/* Donut chart - more prominent */}
          <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 relative">
            <Doughnut
              data={chartData}
              options={{
                cutout: "70%",
                plugins: { legend: { display: false } },
                maintainAspectRatio: true,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {totalBanks}
              </span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight tabular-nums">
              <CountUp
                duration={2}
                decimals={2}
                decimal="."
                prefix="$"
                end={totalCurrentBalance}
              />
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {totalBanks} Bank Account{totalBanks !== 1 ? "s" : ""} connected
            </p>
          </div>

          {/* Add bank button */}
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-brand-main/30 text-brand-main hover:text-brand-hover hover:bg-brand-surface hover:border-brand-main"
            onClick={() => setIsAddBankOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Add bank</span>
          </Button>
        </div>
      </Card>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </div>
  );
}
