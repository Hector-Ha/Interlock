"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { Button } from "@/components/ui";
import { BankCard } from "@/components/features/banks/BankCard";
import { AddBankModal } from "@/components/features/banks/AddBankModal";
import { EmptyBanks } from "@/components/features/banks/EmptyBanks";

export default function BanksPage() {
  const { banks, fetchBanks } = useBankStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Banks</h1>
          <p className="text-slate-500">Manage your connected bank accounts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bank
        </Button>
      </div>

      {/* Banks Grid */}
      {banks.length === 0 ? (
        <EmptyBanks onAddBank={() => setShowAddModal(true)} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>
      )}

      {/* Add Bank Modal */}
      <AddBankModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
