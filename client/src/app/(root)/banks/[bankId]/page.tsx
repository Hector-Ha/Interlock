"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Shield,
  Calendar,
  Wifi,
  ChevronRight,
} from "lucide-react";
import {
  bankService,
  type Account,
  type Transaction,
} from "@/services/bank.service";
import { useBankStore } from "@/stores/bank.store";
import { useToast } from "@/stores/ui.store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { AccountCard } from "@/components/features/banks/AccountCard";
import { TransactionList } from "@/components/features/transactions/TransactionList";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const cardVariants = [
  "from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]",
  "from-[#1a365d] via-[#2c5282] to-[#2b6cb0]",
  "from-[#322659] via-[#44337a] to-[#553c9a]",
  "from-[#1a4731] via-[#22543d] to-[#276749]",
  "from-[#742a2a] via-[#9b2c2c] to-[#c53030]",
] as const;

function hashBankName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function BankDetailsPage() {
  const params = useParams();
  const bankId = params?.bankId as string;
  const router = useRouter();
  const toast = useToast();
  const { selectedBank, selectBank, removeBank } = useBankStore();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBankData = async () => {
      if (!bankId) return;

      setIsLoading(true);
      setError(null);

      try {
        await selectBank(bankId);

        const [accountsRes, txRes] = await Promise.all([
          bankService.getAccounts(bankId),
          bankService.getTransactions(bankId, { limit: 10 }),
        ]);

        setAccounts(accountsRes.accounts);
        setTransactions(txRes.transactions);
      } catch (err: any) {
        setError(err.message || "Failed to load bank details");
      } finally {
        setIsLoading(false);
      }
    };

    loadBankData();
  }, [bankId, selectBank]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await bankService.syncTransactions(bankId);
      toast.success(`Synced ${result.result.added} new transactions`);

      const txRes = await bankService.getTransactions(bankId, { limit: 10 });
      setTransactions(txRes.transactions);
    } catch (err: any) {
      toast.error(err.message || "Failed to sync transactions");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDeleting(true);
    try {
      await bankService.disconnectBank(bankId);
      removeBank(bankId);
      toast.success("Bank disconnected successfully");
      router.push("/banks");
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect bank");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--color-gray-surface)]">
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-[var(--color-gray-main)]">Loading bank details...</p>
        </div>
      </section>
    );
  }

  if (error || !selectedBank) {
    return (
      <section className="min-h-screen bg-[var(--color-gray-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Alert variant="error">
            <AlertTitle>Error Loading Bank</AlertTitle>
            <AlertDescription>{error || "Bank not found"}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  const variantIndex = hashBankName(selectedBank.institutionName) % cardVariants.length;
  const gradientClass = cardVariants[variantIndex];
  const mask = selectedBank.accounts?.[0]?.mask || "••••";
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance.current || 0), 0);

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-[var(--color-gray-main)] hover:text-[var(--color-gray-text)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Banks
          </Button>

          {/* Bank Hero Card */}
          <Card
            padding="none"
            className={cn(
              "relative overflow-hidden bg-gradient-to-br text-white",
              gradientClass
            )}
          >
            {/* Pattern */}
            <div className="absolute inset-0 opacity-[0.04]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="detail-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="12" cy="12" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#detail-grid)" />
              </svg>
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Bank Info */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Wifi className="w-7 h-7 rotate-90" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl lg:text-3xl font-bold">
                        {selectedBank.institutionName}
                      </h1>
                      <Badge
                        className={cn(
                          "text-xs",
                          selectedBank.status === "ACTIVE"
                            ? "bg-[var(--color-success-main)]/20 text-[var(--color-success-soft)] border-0"
                            : "bg-white/20 text-white/80 border-0"
                        )}
                      >
                        {selectedBank.status}
                      </Badge>
                      {selectedBank.isDwollaLinked && (
                        <Badge className="bg-white/20 text-white border-0 text-xs">
                          Transfers Enabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/60 font-mono tracking-wider">
                      •••• •••• •••• {mask}
                    </p>
                  </div>
                </div>

                {/* Balance & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-white/60 text-sm mb-1">Total Balance</p>
                    <p className="text-3xl font-bold tabular-nums">
                      ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
                      Sync
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-[var(--color-error-main)]/20 hover:bg-[var(--color-error-main)]/30 text-white border-0"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Secured via Plaid</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Connected {new Date(selectedBank.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedBank.lastSyncedAt && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      Last synced {new Date(selectedBank.lastSyncedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Accounts Section */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-gray-text)] mb-4">
              Linked Accounts
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} bankId={bankId} />
              ))}
            </div>
          </div>

          {/* Transactions Section */}
          <Card padding="none">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--color-gray-soft)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-gray-text)]">
                  Recent Transactions
                </h2>
                <p className="text-sm text-[var(--color-gray-main)]">
                  Last 10 transactions from this bank
                </p>
              </div>
            </div>
            <TransactionList transactions={transactions} />
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Disconnect Bank"
        description="Are you sure you want to disconnect this bank? All transaction history and accounts associated with this connection will be removed. This action cannot be undone."
        confirmText="Disconnect"
        onConfirm={handleDisconnect}
        isLoading={isDeleting}
        variant="danger"
      />
    </section>
  );
}
