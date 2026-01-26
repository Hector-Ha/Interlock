"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  RefreshCw,
  Plus,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
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
      {/* Bank Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-gray-text)]">
            Connected Banks
          </h2>
          <p className="text-sm text-[var(--color-gray-main)] mt-0.5">
            {banks.length === 0
              ? "No banks connected yet"
              : `${banks.length} bank${banks.length !== 1 ? "s" : ""} linked`}
            {activeBanks > 0 && (
              <span className="text-[var(--color-success-main)]">
                {" "}
                · {activeBanks} active
              </span>
            )}
            {needsAttention > 0 && (
              <span className="text-[var(--color-warning-main)]">
                {" "}
                · {needsAttention} needs attention
              </span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddBankOpen(true)}
          className="bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Bank
        </Button>
      </div>

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
            <div className="flex flex-col gap-3">
              {banks.map((bank) => (
                <Link key={bank.id} href={`/banks/${bank.id}`} className="block">
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
