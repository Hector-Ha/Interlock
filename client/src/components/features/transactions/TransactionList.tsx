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
      <div className="text-center py-10 border border-border rounded-xl bg-muted/30">
        <p className="text-muted-foreground">No recent transactions found.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
            <TableHead className="text-muted-foreground font-medium">
              Transaction
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Amount
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Date
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Category
            </TableHead>
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
              <TableRow
                key={tx.id}
                className="hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[200px]">{tx.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    "font-semibold",
                    isDebit ? "text-error-main" : "text-success-main",
                    "tabular-nums",
                  )}
                >
                  {amount}
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "w-fit px-2.5 py-1 rounded-full text-xs font-semibold",
                      statusConfig.className,
                    )}
                  >
                    {statusConfig.label}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(new Date(tx.date)).dateOnly}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="truncate max-w-[120px] border-border text-muted-foreground"
                  >
                    {tx.category?.[0] || "Uncategorized"}
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
