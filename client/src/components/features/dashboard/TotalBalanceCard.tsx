import React from "react";

export const TotalBalanceCard = ({
  totalBalance,
}: {
  totalBalance: number;
}) => {
  return (
    <div className="p-4 bg-primary text-white rounded-md shadow-md">
      <h3 className="text-sm opacity-80">Total Balance</h3>
      <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
    </div>
  );
};
