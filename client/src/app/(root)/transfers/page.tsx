"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ArrowRightLeft, Send } from "lucide-react";
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
import { TransferForm } from "@/components/features/transfers/TransferForm";
import { P2PTransferForm } from "@/components/features/transfers/P2PTransferForm";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/stores/ui.store";
import { useTransferPolling } from "@/hooks/useTransferPolling";
import { useRefresh } from "@/hooks/useRefresh";
import { RefreshButton } from "@/components/shared/RefreshButton";

type TransferType = "internal" | "p2p";

export default function TransfersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  // Tab state synced with URL query param
  const typeParam = searchParams.get("type");
  const [transferType, setTransferType] = useState<TransferType>(
    typeParam === "p2p" ? "p2p" : "internal",
  );

  // Sync tab state when URL changes
  useEffect(() => {
    const newType = searchParams.get("type");
    if (newType === "p2p") {
      setTransferType("p2p");
    } else if (newType === "internal" || !newType) {
      setTransferType("internal");
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (type: TransferType) => {
    setTransferType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type === "p2p") {
      params.set("type", "p2p");
    } else {
      params.delete("type"); // Default to internal, no query param needed
    }
    router.replace(
      `/transfers${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  // Transfers list state
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransferFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferDetails | null>(null);
  const [showDetail, setShowDetail] = useState(false);
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
    [filters, pagination.limit],
  );

  useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

  const { isRefreshing, refresh } = useRefresh(async () => {
    await loadTransfers(filters, 0);
  });

  useTransferPolling(transfers, {
    enabled: true,
    onStatusChange: () => {
      loadTransfers();
    },
  });

  const handleApplyFilters = (newFilters: TransferFilters) => {
    setFilters(newFilters);
    loadTransfers(newFilters, 0);
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
    loadTransfers();
  };

  // Callback when transfer form succeeds - refresh the list
  const handleTransferSuccess = () => {
    loadTransfers(filters, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transfers</h1>
          <p className="text-slate-500">Send money and manage your transfers</p>
        </div>
        <div className="flex gap-2">
          <RefreshButton onClick={refresh} isRefreshing={isRefreshing} />
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Transfer Tabs & Form */}
        <div className="space-y-6">
          <Card className="p-0 overflow-hidden">
            {/* Transfer Type Tabs Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("internal")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    transferType === "internal"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
                  Between My Accounts
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("p2p")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    transferType === "p2p"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send to User
                </button>
              </div>
            </div>

            {/* Form Content */}
            {transferType === "internal" ? (
              <TransferForm
                onSuccess={handleTransferSuccess}
                isEmbedded={true}
                className="pt-6"
              />
            ) : (
              <P2PTransferForm
                onSuccess={handleTransferSuccess}
                isEmbedded={true}
                className="pt-6"
              />
            )}
          </Card>
        </div>

        {/* Right Column: Transfer History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Transfer History
            </h2>
          </div>

          <Card className="overflow-hidden p-0 h-fit">
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
                <p className="text-slate-500 mt-1">
                  You haven't made any transfers yet, or no transfers match your
                  filters.
                </p>
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
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <p className="text-sm text-slate-500">
                  Showing {pagination.offset + 1} to{" "}
                  {Math.min(
                    pagination.offset + transfers.length,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.offset === 0}
                    onClick={() =>
                      handlePageChange(
                        Math.max(0, pagination.offset - pagination.limit),
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
        </div>
      </div>

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
