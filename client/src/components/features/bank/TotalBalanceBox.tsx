import React from "react";
import AnimatedBalanceCounter from "../../shared/AnimatedBalanceCounter";
import DoughnutChart from "../../shared/DoughnutChart";
import { TotalBalanceBoxProps } from "@/types";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="flex items-center gap-6 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <div className="shrink-0">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Bank Accounts: <span className="text-brand-main">{totalBanks}</span>
        </h2>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Current Balance</p>
          <div className="flex items-center gap-2">
            <AnimatedBalanceCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
