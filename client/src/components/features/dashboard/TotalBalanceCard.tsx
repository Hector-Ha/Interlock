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

  // Show actual data, or a 'No Data' ring if empty
  const hasAccounts = accounts.length > 0;

  // Use brand colors from design system
  const chartData = hasAccounts
    ? {
        datasets: [
          {
            label: "Banks",
            data: accounts.map((a) => a.balance.current),
            backgroundColor: ["#7839ee", "#6d28d9", "#c4b5fd"], // brand-main, brand-hover, brand-disabled
          },
        ],
        labels: accounts.map((a) => a.name),
      }
    : {
        // Empty state - gray-soft
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
      <Card className="flex items-center gap-4 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-soft">
        {/* Donut chart on LEFT */}
        <div className="h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] shrink-0 relative">
          <Doughnut
            data={chartData}
            options={{
              cutout: "70%",
              plugins: { legend: { display: false } },
              maintainAspectRatio: true,
            }}
          />
        </div>

        {/* Text content on RIGHT */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {totalBanks} Bank Account{totalBanks !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">Total Current Balance</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
            <CountUp
              duration={2}
              decimals={2}
              decimal="."
              prefix="$"
              end={totalCurrentBalance}
            />
          </p>
        </div>

        {/* Add bank button */}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-brand-main hover:text-brand-hover hover:bg-brand-surface"
          onClick={() => setIsAddBankOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Add bank</span>
        </Button>
      </Card>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </div>
  );
}
