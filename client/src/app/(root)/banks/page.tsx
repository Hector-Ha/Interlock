"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, CreditCard } from "lucide-react";
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

  // Calculate total accounts across all banks
  const totalAccounts = banks.reduce(
    (acc, bank) => acc + (bank.accounts?.length || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            My Banks
          </h1>
          <p className="text-muted-foreground">
            Manage your connected bank accounts
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-main hover:bg-brand-hover text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank
        </Button>
      </div>

      {/* Stats Summary - only show when banks exist */}
      {banks.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-brand-surface to-brand-soft/50 rounded-xl p-4 sm:p-5 border border-brand-disabled/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-main/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-brand-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {banks.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Connected {banks.length === 1 ? "Bank" : "Banks"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-success-surface to-success-soft/50 rounded-xl p-4 sm:p-5 border border-success-disabled/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success-main/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-success-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalAccounts}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total {totalAccounts === 1 ? "Account" : "Accounts"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banks Grid */}
      {banks.length === 0 ? (
        <EmptyBanks onAddBank={() => setShowAddModal(true)} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank, index) => (
            <BankCard key={bank.id} bank={bank} index={index} />
          ))}
        </div>
      )}

      {/* Add Bank Modal */}
      <AddBankModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
