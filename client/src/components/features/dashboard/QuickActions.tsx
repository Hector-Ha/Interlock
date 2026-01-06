import React from "react";

export const QuickActions = () => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold mb-2">Quick Actions</h3>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-primary text-white text-sm rounded">
          Transfer
        </button>
        <button className="px-3 py-1 bg-secondary text-white text-sm rounded">
          Deposit
        </button>
      </div>
    </div>
  );
};
