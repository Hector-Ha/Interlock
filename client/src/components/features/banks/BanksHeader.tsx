"use client";

import { Building2, CreditCard, Shield, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface BanksHeaderProps {
  totalBanks: number;
  totalAccounts: number;
  onAddBank: () => void;
}

export function BanksHeader({ totalBanks, totalAccounts, onAddBank }: BanksHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-gray-text)]">
            My Banks
          </h1>
          <p className="text-[var(--color-gray-main)]">
            Manage your connected financial institutions
          </p>
        </div>
        <Button
          onClick={onAddBank}
          className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white shadow-lg shadow-[var(--color-brand-main)]/20 hover:shadow-xl hover:shadow-[var(--color-brand-main)]/30 transition-all w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank
        </Button>
      </div>

      {/* Stats Cards */}
      {totalBanks > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            padding="none"
            className="relative overflow-hidden p-5 border-[var(--color-brand-soft)]"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-brand-main)] rounded-full blur-[40px] opacity-10" />
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-surface)]">
                <Building2 className="h-6 w-6 text-[var(--color-brand-main)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-gray-text)] tabular-nums">
                  {totalBanks}
                </p>
                <p className="text-sm text-[var(--color-gray-main)]">
                  {totalBanks === 1 ? "Bank" : "Banks"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            padding="none"
            className="relative overflow-hidden p-5 border-[var(--color-success-soft)]"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-success-main)] rounded-full blur-[40px] opacity-10" />
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-success-surface)]">
                <CreditCard className="h-6 w-6 text-[var(--color-success-main)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-gray-text)] tabular-nums">
                  {totalAccounts}
                </p>
                <p className="text-sm text-[var(--color-gray-main)]">
                  {totalAccounts === 1 ? "Account" : "Accounts"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            padding="none"
            className="relative overflow-hidden p-5 border-[var(--color-gray-soft)] col-span-2 lg:col-span-2"
          >
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gray-surface)]">
                <Shield className="h-6 w-6 text-[var(--color-success-main)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--color-gray-text)]">
                    Bank-Grade Security
                  </p>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success-main)] animate-pulse" />
                </div>
                <p className="text-sm text-[var(--color-gray-main)]">
                  256-bit encryption • Read-only access • SOC 2 certified
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
