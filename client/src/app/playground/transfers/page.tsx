"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Filter, ArrowLeft } from "lucide-react";
import { type Transfer, type TransferFilters } from "@/types/transfer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TransferRow } from "@/components/features/transfers/TransferRow";
import { TransferFiltersModal } from "@/components/features/transfers/TransferFiltersModal";
import { MOCK_TRANSFERS } from "@/lib/mock-data";

export default function PlaygroundTransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filters, setFilters] = useState<TransferFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initial load
    setTransfers(MOCK_TRANSFERS as unknown as Transfer[]);
  }, []);

  const handleApplyFilters = (newFilters: TransferFilters) => {
    setFilters(newFilters);

    // Simple client-side filtering for playground
    let filtered = [...MOCK_TRANSFERS] as unknown as Transfer[];

    if (newFilters.status && newFilters.status !== "all") {
      filtered = filtered.filter((t) => t.status === newFilters.status);
    }

    // Date filtering (simplified for playground)
    if (newFilters.startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.createdAt) >= new Date(newFilters.startDate!)
      );
    }
    if (newFilters.endDate) {
      filtered = filtered.filter(
        (t) => new Date(t.createdAt) <= new Date(newFilters.endDate!)
      );
    }

    setTransfers(filtered);
    setShowFilters(false);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/playground"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Playground Root
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Transfers History Playground
          </h1>
          <p className="text-slate-500">
            Testing the transfer history view with mock data. No backend
            required.
          </p>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Transfers
              </h2>
              <p className="text-sm text-slate-500">
                History of your transactions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Link href="/playground/transfers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </Link>
            </div>
          </div>

          {/* Transfers List */}
          <Card className="overflow-hidden p-0">
            {transfers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No transfers match your filters.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transfers.map((transfer) => (
                  <TransferRow key={transfer.id} transfer={transfer} />
                ))}
              </div>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Active Filters</h3>
              <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(filters, null, 2)}
              </pre>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Mock Data Status</h3>
              <p className="text-sm text-slate-600">
                Using {transfers.length} mock records. Reset filters to see all
                3.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <TransferFiltersModal
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
