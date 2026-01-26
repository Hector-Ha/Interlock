"use client";

import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { TransferRow } from "./TransferRow";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import type { Transfer, TransferFilters } from "@/types/transfer";

interface TransferHistoryCardProps {
  transfers: Transfer[];
  isLoading: boolean;
  pagination: {
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
  filters: TransferFilters;
  onFilterChange: (filters: Partial<TransferFilters>) => void;
  onTransferClick: (transferId: string) => void;
  onPageChange: (offset: number) => void;
}

const sortOptions = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Amount: High to Low" },
  { value: "amount_asc", label: "Amount: Low to High" },
];

export function TransferHistoryCard({
  transfers,
  isLoading,
  pagination,
  filters,
  onFilterChange,
  onTransferClick,
  onPageChange,
}: TransferHistoryCardProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    onPageChange(newOffset);
  };

  return (
    <Card
      padding="none"
      className="overflow-hidden border-[var(--color-gray-soft)]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
        <div>
          <CardTitle className="text-lg">Transfer History</CardTitle>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search transfers..."
              value={filters.search || ""}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              startIcon={<Search className="w-4 h-4" />}
              className="h-9 text-sm"
              containerClassName="w-full"
            />
          </div>
          <div className="w-full sm:w-40 shrink-0">
            <Select
              options={sortOptions}
              value={filters.sortBy || "date_desc"}
              onChange={(value) =>
                onFilterChange({
                  sortBy: value as TransferFilters["sortBy"],
                })
              }
              placeholder="Sort by"
              triggerClassName="h-9 text-sm"
              itemClassName="text-sm py-2"
            />
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      {(filters.search ||
        (filters.startDate && filters.endDate) ||
        filters.status) && (
        <div className="px-4 sm:px-5 py-2 bg-[var(--color-gray-surface)] border-b border-[var(--color-gray-soft)]">
          <p className="text-xs text-[var(--color-gray-main)]">
            Showing {transfers.length} of {pagination.total} transactions
            {filters.search && <span> matching "{filters.search}"</span>}
          </p>
        </div>
      )}

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
              You haven't made any transfers yet, or no transfers match your
              current filters.
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
      {!isLoading && totalPages > 1 && (
        <div className="p-4 border-t border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/30">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Card>
  );
}
