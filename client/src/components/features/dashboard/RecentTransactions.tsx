import React from "react";

export const RecentTransactions = ({
  transactions,
}: {
  transactions: any[];
}) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold mb-2">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No recent transactions.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx: any, i: number) => (
            <li key={tx.id || i} className="text-sm flex justify-between">
              <span>{tx.name || "Transaction"}</span>
              <span>{tx.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
