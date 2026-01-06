"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatDateTime,
  cn,
  getTransactionCategoryStyles,
} from "@/lib/utils";
import type { Transaction } from "@/services/bank.service";
import { Badge } from "@/components/ui";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-slate-50">
        <p className="text-slate-500">No recent transactions found.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isDebit = tx.amount > 0;
            const amount = isDebit
              ? `-$${tx.amount.toFixed(2)}`
              : `+$${Math.abs(tx.amount).toFixed(2)}`;

            const getStatusBadge = (status: Transaction["status"]) => {
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
                    className:
                      "bg-brand-surface text-brand-text border border-brand-text",
                    label: "Processing",
                  };
                case "FAILED":
                case "DECLINED":
                case "RETURNED":
                  return {
                    className:
                      "bg-error-surface text-error-text border border-error-text",
                    label: status,
                  };
                case "CANCELLED":
                default:
                  return {
                    className:
                      "bg-gray-surface text-gray-text border border-gray-text",
                    label: "Cancelled",
                  };
              }
            };

            const statusConfig = getStatusBadge(tx.status);

            return (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[200px]">{tx.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    "font-semibold",
                    isDebit ? "text-error-main" : "text-success-main"
                  )}
                >
                  {amount}
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "w-fit px-2.5 py-1 rounded-full text-xs font-semibold",
                      statusConfig.className
                    )}
                  >
                    {statusConfig.label}
                  </div>
                </TableCell>
                <TableCell className="text-gray-main">
                  {formatDateTime(new Date(tx.date)).dateOnly}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="truncate max-w-[120px]">
                    {tx.category[0] || "Uncategorized"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
