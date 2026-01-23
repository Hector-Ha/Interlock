"use client";

import { History, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { TransferRow } from "./TransferRow";
import type { Transfer } from "@/types/transfer";

interface TransferHistoryCardProps {
  transfers: Transfer[];
  isLoading: boolean;
  pagination: {
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
  onTransferClick: (transferId: string) => void;
  onPageChange: (offset: number) => void;
}

export function TransferHistoryCard({
  transfers,
  isLoading,
  pagination,
  onTransferClick,
  onPageChange,
}: TransferHistoryCardProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <Card padding="none" className="overflow-hidden border-[var(--color-gray-soft)]">
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between p-5 border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[var(--color-brand-main)]" />
          <CardTitle className="text-lg">Transfer History</CardTitle>
        </div>
        {pagination.total > 0 && (
          <span className="text-sm text-[var(--color-gray-main)]">
            {pagination.total} transfer{pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
          </div>
        ) : transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gray-surface)] mb-4">
              <Search className="h-8 w-8 text-[var(--color-gray-disabled)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-gray-text)] mb-1">
              No transfers found
            </h3>
            <p className="text-sm text-[var(--color-gray-main)] max-w-xs">
              You haven't made any transfers yet, or no transfers match your current filters.
            </p>
          </div>
        ) : (
          <div>
            {transfers.map((transfer) => (
              <TransferRow
                key={transfer.id}
                transfer={transfer}
                onClick={() => onTransferClick(transfer.id)}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {!isLoading && transfers.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
          <p className="text-sm text-[var(--color-gray-main)]">
            Showing {pagination.offset + 1}-
            {Math.min(pagination.offset + transfers.length, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.offset === 0}
              onClick={() => onPageChange(Math.max(0, pagination.offset - pagination.limit))}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-[var(--color-gray-text)]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.offset + pagination.limit)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
