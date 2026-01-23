"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { transferService } from "@/services/transfer.service";
import type { Transfer, TransferDetails, TransferFilters } from "@/types/transfer";
import { Card } from "@/components/ui/Card";
import { TransfersHeader } from "@/components/features/transfers/TransfersHeader";
import { TransferTypeCard } from "@/components/features/transfers/TransferTypeCard";
import { TransferHistoryCard } from "@/components/features/transfers/TransferHistoryCard";
import { TransferFiltersModal } from "@/components/features/transfers/TransferFiltersModal";
import { TransferDetailModal } from "@/components/features/transfers/TransferDetailModal";
import { TransferForm } from "@/components/features/transfers/TransferForm";
import { P2PTransferForm } from "@/components/features/transfers/P2PTransferForm";
import { TransfersPageSkeleton } from "@/components/features/transfers/TransfersSkeleton";
import { useToast } from "@/stores/ui.store";
import { useTransferPolling } from "@/hooks/useTransferPolling";
import { useRefresh } from "@/hooks/useRefresh";

type TransferType = "internal" | "p2p";

export default function TransfersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const typeParam = searchParams.get("type");
  const [transferType, setTransferType] = useState<TransferType>(
    typeParam === "p2p" ? "p2p" : "internal"
  );

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransferFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferDetails | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    hasMore: false,
    offset: 0,
    limit: 10,
  });

  useEffect(() => {
    const newType = searchParams.get("type");
    if (newType === "p2p") {
      setTransferType("p2p");
    } else if (newType === "internal" || !newType) {
      setTransferType("internal");
    }
  }, [searchParams]);

  const handleTabChange = (type: TransferType) => {
    setTransferType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type === "p2p") {
      params.set("type", "p2p");
    } else {
      params.delete("type");
    }
    router.replace(`/transfers${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

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
  }, [loadTransfers]);

  const { isRefreshing, refresh } = useRefresh(async () => {
    await loadTransfers(filters, 0);
  });

  useTransferPolling(transfers, {
    enabled: true,
    onStatusChange: () => loadTransfers(),
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

  const handleTransferSuccess = () => {
    loadTransfers(filters, 0);
  };

  const pendingCount = transfers.filter((t) => t.status === "PENDING").length;

  if (isLoading && transfers.length === 0) {
    return <TransfersPageSkeleton />;
  }

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Header with Stats */}
          <TransfersHeader
            onRefresh={refresh}
            isRefreshing={isRefreshing}
            onOpenFilters={() => setShowFilters(true)}
            pendingCount={pendingCount}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Transfer Form */}
            <div className="space-y-4">
              {/* Transfer Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <TransferTypeCard
                  type="internal"
                  isActive={transferType === "internal"}
                  onClick={() => handleTabChange("internal")}
                />
                <TransferTypeCard
                  type="p2p"
                  isActive={transferType === "p2p"}
                  onClick={() => handleTabChange("p2p")}
                />
              </div>

              {/* Transfer Form */}
              <Card padding="none" className="overflow-hidden border-[var(--color-gray-soft)]">
                {transferType === "internal" ? (
                  <TransferForm onSuccess={handleTransferSuccess} isEmbedded className="p-6" />
                ) : (
                  <P2PTransferForm onSuccess={handleTransferSuccess} isEmbedded className="p-6" />
                )}
              </Card>
            </div>

            {/* Right Column: Transfer History */}
            <TransferHistoryCard
              transfers={transfers}
              isLoading={isLoading}
              pagination={pagination}
              onTransferClick={handleTransferClick}
              onPageChange={handlePageChange}
            />
          </div>
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
    </section>
  );
}
