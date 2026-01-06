import React from "react";

export const BanksList = ({ banks }: { banks: any[] }) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold mb-2">My Banks</h3>
      {banks.length === 0 ? (
        <p className="text-sm text-gray-500">No banks connected.</p>
      ) : (
        <ul className="space-y-2">
          {banks.map((bank: any) => (
            <li key={bank.id} className="text-sm">
              {bank.institutionName} -{" "}
              <span className="text-gray-400">Connected</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
