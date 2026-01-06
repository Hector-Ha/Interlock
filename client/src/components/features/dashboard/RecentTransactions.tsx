import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types/bank";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-500">
        No recent transactions.
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <p className="text-sm text-gray-500">
          Your latest financial activities
        </p>
      </div>
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="py-4 pl-6">Transaction</TableHead>
            <TableHead className="py-4">Amount</TableHead>
            <TableHead className="py-4">Status</TableHead>
            <TableHead className="py-4 pr-6">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="font-medium py-4 pl-6">
                <div className="flex flex-col">
                  <span>{tx.name}</span>
                  <span className="text-xs text-slate-500">
                    {tx.category || "Uncategorized"}
                  </span>
                </div>
              </TableCell>
              <TableCell
                className={`py-4 ${
                  tx.amount > 0
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-900"
                }`}
              >
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="py-4">
                <div
                  className={`w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                    tx.status === "SUCCESS"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {tx.status}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 py-4 pr-6">
                {new Date(tx.date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
