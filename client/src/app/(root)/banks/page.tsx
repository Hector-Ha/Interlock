"use client";

import { useEffect, useState } from "react";
import { useBankStore } from "@/stores/bank.store";
import { BanksHeader } from "@/components/features/banks/BanksHeader";
import { BankCard } from "@/components/features/banks/BankCard";
import { AddBankModal } from "@/components/features/banks/AddBankModal";
import { EmptyBanks } from "@/components/features/banks/EmptyBanks";
import { BanksSkeleton } from "@/components/features/banks/BanksSkeleton";

export default function BanksPage() {
  const { banks, fetchBanks, isLoading } = useBankStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const totalAccounts = banks.reduce(
    (acc, bank) => acc + (bank.accounts?.length || 0),
    0
  );

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--color-gray-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <BanksSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Header with Stats */}
          <BanksHeader
            totalBanks={banks.length}
            totalAccounts={totalAccounts}
            onAddBank={() => setShowAddModal(true)}
          />

          {/* Banks Grid or Empty State */}
          {banks.length === 0 ? (
            <EmptyBanks onAddBank={() => setShowAddModal(true)} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {banks.map((bank, index) => (
                <BankCard key={bank.id} bank={bank} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddBankModal open={showAddModal} onOpenChange={setShowAddModal} />
    </section>
  );
}
