"use client";

import CountUp from "react-countup";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card } from "@/components/ui/Card";
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
  // Show actual data, or a 'No Data'ring if empty
  const hasAccounts = accounts.length > 0;

  const chartData = hasAccounts
    ? {
        datasets: [
          {
            label: "Banks",
            data: accounts.map((a) => a.balance.current),
            backgroundColor: ["#7839EE", "#5B21B6", "#A78BFA"],
          },
        ],
        labels: accounts.map((a) => a.name),
      }
    : {
        // Empty state
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
    <Card
      className={`flex flex-col gap-6 p-8 rounded-2xl shadow-xl border-gray-100 ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Total Current Balance
        </h2>
        <div className="flex-center gap-2">
          <p className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            <CountUp
              duration={2.5}
              decimals={2}
              decimal="."
              prefix="$"
              end={totalCurrentBalance}
            />
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-4">
        <div className="h-[140px] w-[140px] relative">
          <Doughnut
            data={chartData}
            options={{
              cutout: "70%",
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-600">
            Total Banks Linked:{" "}
            <span className="font-bold text-gray-900">{totalBanks}</span>
          </p>
          <div className="flex flex-col gap-2">
            {/* Legend */}
            {hasAccounts &&
              accounts.slice(0, 3).map((account, i) => (
                <div key={account.id} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: chartData.datasets[0].backgroundColor[i],
                    }}
                  ></span>
                  <span className="text-xs text-gray-500">{account.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
