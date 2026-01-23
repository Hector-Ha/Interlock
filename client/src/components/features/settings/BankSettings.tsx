"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddBankModal } from "@/components/features/banks/AddBankModal";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function BankSettings() {
  const { banks, isLoading } = useBankStore();
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  const activeBanks = banks.filter((b) => b.status === "ACTIVE").length;
  const needsAttention = banks.filter((b) => b.status !== "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Bank Overview Card */}
      <Card
        padding="none"
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2a2a35] to-[var(--color-brand-text)]"
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="bank-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 16h32M16 0v32"
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bank-grid)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-brand-main)] rounded-full blur-[100px] opacity-20" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[var(--color-success-main)] rounded-full blur-[120px] opacity-10" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm">
                <Building2 className="h-7 w-7 text-[var(--color-brand-main)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Connected Banks</h2>
                <p className="text-white/60 text-sm mt-0.5">
                  Manage your linked bank accounts
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success-main)]/20">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success-main)]" />
                    <span className="text-xs text-[var(--color-success-main)] font-medium">
                      {activeBanks} Active
                    </span>
                  </div>
                  {needsAttention > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-warning-main)]/20">
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning-main)]" />
                      <span className="text-xs text-[var(--color-warning-main)] font-medium">
                        {needsAttention} Need Attention
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10">
                    <Shield className="h-3.5 w-3.5 text-white/70" />
                    <span className="text-xs text-white/70 font-medium">
                      Plaid Secured
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 gap-1.5"
              onClick={() => setIsAddBankOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Bank
            </Button>
          </div>
        </div>
      </Card>

      {/* Bank List Card */}
      <Card padding="none" className="border-[var(--color-gray-soft)]">
        <div className="p-5 border-b border-[var(--color-gray-soft)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-success-surface)]">
              <Building2 className="h-5 w-5 text-[var(--color-success-main)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-text)]">
                Your Banks
              </h3>
              <p className="text-sm text-[var(--color-gray-main)]">
                {banks.length} bank{banks.length !== 1 ? "s" : ""} connected
              </p>
            </div>
          </div>
          <Link href="/banks">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-[var(--color-gray-main)]" />
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-[var(--color-gray-surface)] mb-4">
                <Building2 className="h-8 w-8 text-[var(--color-gray-main)]" />
              </div>
              <h4 className="text-lg font-semibold text-[var(--color-gray-text)] mb-1">
                No banks connected
              </h4>
              <p className="text-sm text-[var(--color-gray-main)] mb-4">
                Connect a bank account to get started
              </p>
              <Button onClick={() => setIsAddBankOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect a Bank
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banks.map((bank) => (
                <Link key={bank.id} href={`/banks/${bank.id}`}>
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      "hover:bg-[var(--color-gray-surface)] hover:shadow-sm cursor-pointer group",
                      bank.status === "ACTIVE"
                        ? "border-[var(--color-gray-soft)]"
                        : "border-[var(--color-warning-soft)] bg-[var(--color-warning-surface)]/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-surface)]">
                        <span className="text-lg font-bold text-[var(--color-brand-main)]">
                          {getInitials(bank.institutionName)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-gray-text)]">
                          {bank.institutionName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {bank.status === "ACTIVE" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success-main)]" />
                              <span className="text-xs text-[var(--color-success-main)]">
                                Connected
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning-main)]" />
                              <span className="text-xs text-[var(--color-warning-main)]">
                                Requires attention
                              </span>
                            </>
                          )}
                          <span className="text-xs text-[var(--color-gray-main)]">
                            • {bank.accounts?.length || 0} account
                            {(bank.accounts?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={bank.status === "ACTIVE" ? "success" : "warning"}
                      >
                        {bank.status}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-[var(--color-gray-main)] group-hover:text-[var(--color-gray-text)] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>

      <AddBankModal open={isAddBankOpen} onOpenChange={setIsAddBankOpen} />
    </div>
  );
}
