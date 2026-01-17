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

// Helper function to get status badge styling
function getStatusBadge(status: Transaction["status"]) {
  switch (status) {
    case "SUCCESS":
      return {
        className:
          "bg-success-surface text-success-text border border-success-text",
        label: "Success",
      };
    case "PENDING":
      return {
        className:
          "bg-warning-surface text-warning-text border border-warning-text",
        label: "Pending",
      };
    case "PROCESSING":
      return {
        className: "bg-brand-surface text-brand-text border border-brand-text",
        label: "Processing",
      };
    case "FAILED":
    case "DECLINED":
    case "RETURNED":
      return {
        className: "bg-error-surface text-error-text border border-error-text",
        label: status,
      };
    case "CANCELLED":
    default:
      return {
        className: "bg-gray-surface text-gray-text border border-gray-text",
        label: "Cancelled",
      };
  }
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
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <p className="text-sm text-gray-500">
          Your latest financial activities
        </p>
      </div>

      {/* Mobile List View */}
      <div className="block md:hidden divide-y divide-gray-100">
        {transactions.map((tx) => {
          const isDebit = tx.amount > 0;
          const amount = isDebit
            ? `-$${tx.amount.toFixed(2)}`
            : `+$${Math.abs(tx.amount).toFixed(2)}`;
          const statusConfig = getStatusBadge(tx.status);

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between px-4 py-3 gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{tx.name}</p>
                <p className="text-xs text-gray-500">
                  {tx.category || "Uncategorized"} •{" "}
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`font-semibold ${
                    isDebit ? "text-error-main" : "text-success-main"
                  } tabular-nums`}
                >
                  {amount}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
            {transactions.map((tx) => {
              const isDebit = tx.amount > 0;
              const amount = isDebit
                ? `-$${tx.amount.toFixed(2)}`
                : `+$${Math.abs(tx.amount).toFixed(2)}`;
              const statusConfig = getStatusBadge(tx.status);

              return (
                <TableRow
                  key={tx.id}
                  className="hover:bg-gray-surface/50 transition-colors"
                >
                  <TableCell className="font-medium py-4 pl-6">
                    <div className="flex flex-col">
                      <span>{tx.name}</span>
                      <span className="text-xs text-gray-main">
                        {tx.category || "Uncategorized"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`py-4 ${
                      isDebit
                        ? "text-error-main font-semibold"
                        : "text-success-main font-semibold"
                    } tabular-nums`}
                  >
                    {amount}
                  </TableCell>
                  <TableCell className="py-4">
                    <div
                      className={`w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-main py-4 pr-6">
                    {new Date(tx.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
