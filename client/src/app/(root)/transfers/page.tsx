"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { transferService } from "@/services/transfer.service";
import type {
  Transfer,
  TransferDetails,
  TransferFilters,
} from "@/types/transfer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TransferRow } from "@/components/features/transfers/TransferRow";
import { TransferFiltersModal } from "@/components/features/transfers/TransferFiltersModal";
import { TransferDetailModal } from "@/components/features/transfers/TransferDetailModal";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/stores/ui.store";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransferFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferDetails | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const toast = useToast();
  const [pagination, setPagination] = useState({
    total: 0,
    hasMore: false,
    offset: 0,
    limit: 10,
  });

  const loadTransfers = useCallback(
    async (currentFilters?: TransferFilters, currentOffset = 0) => {
      setIsLoading(true);
      try {
        const activeFilters = currentFilters || filters;
        const response = await transferService.getTransfers({
          ...activeFilters,
          limit: pagination.limit,
          offset: currentOffset,
        });
        setTransfers(response.transfers);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Failed to load transfers", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadTransfers();
  }, []);

  const handleApplyFilters = (newFilters: TransferFilters) => {
    setFilters(newFilters);
    loadTransfers(newFilters, 0); // Reset offset
  };

  const handlePageChange = (newOffset: number) => {
    loadTransfers(filters, newOffset);
  };

  const handleTransferClick = async (transferId: string) => {
    try {
      const { transfer } = await transferService.getTransfer(transferId);
      setSelectedTransfer(transfer);
      setShowDetail(true);
    } catch (err) {
      console.error("Failed to load transfer details", err);
    }
  };

  const handleCancelTransfer = async (transferId: string) => {
    await transferService.cancelTransfer(transferId);
    toast.success("Transfer cancelled successfully");
    loadTransfers(); // Refresh the list
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transfers</h1>
          <p className="text-slate-500">View and manage your money transfers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link href="/transfers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </Link>
        </div>
      </div>

      {/* Transfers List */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : transfers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Filter className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              No transfers found
            </h3>
            <p className="text-slate-500 mt-1 mb-6">
              You haven't made any transfers yet, or no transfers match your
              filters.
            </p>
            <Link href="/transfers/new">
              <Button>Make a transfer</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transfers.map((transfer) => (
              <TransferRow
                key={transfer.id}
                transfer={transfer}
                onClick={() => handleTransferClick(transfer.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && transfers.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {pagination.offset + 1} to{" "}
              {Math.min(pagination.offset + transfers.length, pagination.total)}{" "}
              of {pagination.total} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.offset === 0}
                onClick={() =>
                  handlePageChange(
                    Math.max(0, pagination.offset - pagination.limit)
                  )
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasMore}
                onClick={() =>
                  handlePageChange(pagination.offset + pagination.limit)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <TransferFiltersModal
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onApply={handleApplyFilters}
      />

      <TransferDetailModal
        transfer={selectedTransfer}
        open={showDetail}
        onOpenChange={setShowDetail}
        onCancel={handleCancelTransfer}
      />
    </div>
  );
}
