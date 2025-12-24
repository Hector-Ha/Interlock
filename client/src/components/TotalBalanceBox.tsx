import React from "react";
import AnimatedBalanceCounter from "./AnimatedBalanceCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  account,
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance-box">
      <div className="total-balance-chart">
        <DoughnutChart account={account} />
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
