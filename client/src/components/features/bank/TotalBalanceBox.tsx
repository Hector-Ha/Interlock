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
    <section className="total-balance-box">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="total-balance-content">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="total-balance-details">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            {<AnimatedBalanceCounter amount={totalCurrentBalance} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
