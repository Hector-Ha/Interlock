"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Shield,
  Calendar,
  Wifi,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";
import {
  bankService,
  type Account,
  type Transaction,
} from "@/services/bank.service";
import { useBankStore } from "@/stores/bank.store";
import { useToast } from "@/stores/ui.store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { AccountCard } from "@/components/features/banks/AccountCard";
import { BankDetailSkeleton } from "@/components/features/banks/BankDetailSkeleton";
import { TransactionList } from "@/components/features/transactions/TransactionList";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";

const TRANSACTIONS_PER_PAGE = 10;

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
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
  ] as const;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (dateFilter === "all") return true;

      const txDate = new Date(tx.date);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dateFilter) {
        case "7d":
          return diffDays <= 7;
        case "30d":
          return diffDays <= 30;
        case "90d":
          return diffDays <= 90;
        default:
          return true;
      }
    });
  }, [transactions, searchQuery, dateFilter]);

  const totalPages = Math.ceil(
    filteredTransactions.length / TRANSACTIONS_PER_PAGE,
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return filteredTransactions.slice(
      startIndex,
      startIndex + TRANSACTIONS_PER_PAGE,
    );
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter]);

  useEffect(() => {
    const loadBankData = async () => {
      if (!bankId) return;

      setIsLoading(true);
      setError(null);

      try {
        await selectBank(bankId);

        const [accountsRes, txRes] = await Promise.all([
          bankService.getAccounts(bankId),
          bankService.getTransactions(bankId),
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

      const txRes = await bankService.getTransactions(bankId);
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
    return <BankDetailSkeleton />;
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

  const variantIndex =
    hashBankName(selectedBank.institutionName) % cardVariants.length;
  const gradientClass = cardVariants[variantIndex];
  const mask = selectedBank.accounts?.[0]?.mask || "••••";
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance.current || 0),
    0,
  );

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
              gradientClass,
            )}
          >
            {/* Pattern */}
            <div className="absolute inset-0 opacity-[0.04]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="detail-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="12" cy="12" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#detail-grid)" />
              </svg>
            </div>

            <div className="relative p-6 sm:p-8">
              {/* Top Row: Bank Icon + Actions */}
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Wifi className="w-7 h-7 rotate-90" aria-hidden="true" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-white/10 text-white/80 hover:bg-white/30 hover:text-white border-0 transition-colors"
                    aria-label="Sync transactions"
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4 mr-2",
                        isSyncing && "animate-spin",
                      )}
                      aria-hidden="true"
                    />
                    Sync
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-[var(--color-error-main)]/10 text-[var(--color-error-soft)] hover:bg-[var(--color-error-main)]/40 hover:text-[var(--color-error-soft)] border-0 transition-colors"
                    aria-label="Disconnect bank"
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Disconnect
                  </Button>
                </div>
              </div>

              {/* Middle Section: Balance */}
              <div className="mb-8">
                <p className="text-white/50 text-sm mb-1">Total Balance</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <p className="text-4xl lg:text-5xl font-bold tabular-nums tracking-tight text-white/60">
                      $
                    </p>
                    <p className="text-4xl lg:text-5xl font-bold tabular-nums tracking-tight">
                      {isBalanceVisible
                        ? `${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "••••••••"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={
                      isBalanceVisible ? "Hide balance" : "Show balance"
                    }
                  >
                    {isBalanceVisible ? (
                      <EyeOff
                        className="w-5 h-5 text-white/70"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5 text-white/70"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Section: Bank Info */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6 border-t border-white/10">
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold mb-1">
                    {selectedBank.institutionName}
                  </h1>
                  <p className="text-white/50 font-mono text-sm tracking-widest">
                    •••• •••• •••• {mask}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold select-none pointer-events-none",
                      selectedBank.status === "ACTIVE"
                        ? "bg-[var(--color-success-main)]/30 text-[var(--color-success-soft)] ring-1 ring-[var(--color-success-main)]/50"
                        : "bg-white/30 text-white ring-1 ring-white/30",
                    )}
                    aria-label={`Status: ${selectedBank.status}`}
                  >
                    {selectedBank.status === "ACTIVE" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-main)] mr-1.5 animate-pulse" />
                    )}
                    {selectedBank.status}
                  </span>
                  {selectedBank.isDwollaLinked && (
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/30 text-white ring-1 ring-white/30 select-none pointer-events-none"
                      aria-label="Transfers enabled"
                    >
                      Transfers Enabled
                    </span>
                  )}
                </div>
              </div>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-white/40 text-xs">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Secured via Plaid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    Connected{" "}
                    {new Date(selectedBank.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedBank.lastSyncedAt && (
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      Synced{" "}
                      {new Date(selectedBank.lastSyncedAt).toLocaleDateString()}
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  bankId={bankId}
                />
              ))}
            </div>
          </div>

          {/* Transactions Section */}
          <Card padding="none" className="overflow-hidden">
            {/* Header with Title + Search + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 border-b border-[var(--color-gray-soft)]">
              <h2 className="text-lg font-semibold text-[var(--color-gray-text)] shrink-0">
                Related Transactions
              </h2>
              <div className="flex items-center gap-3 flex-1 sm:justify-end">
                <div className="flex-1 sm:flex-initial sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search transactions…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startIcon={<Search className="w-4 h-4" />}
                    className="h-9 text-sm"
                    containerClassName="w-full"
                  />
                </div>
                <div className="w-28 shrink-0">
                  <Select
                    options={[...dateFilterOptions]}
                    value={dateFilter}
                    onChange={(value) => setDateFilter(value)}
                    placeholder="Period"
                    triggerClassName="h-9 text-sm"
                    itemClassName="text-sm py-2"
                  />
                </div>
              </div>
            </div>
            {/* Results info */}
            {(searchQuery || dateFilter !== "all") && (
              <div className="px-4 sm:px-5 py-2 bg-[var(--color-gray-surface)] border-b border-[var(--color-gray-soft)]">
                <p className="text-xs text-[var(--color-gray-main)]">
                  Showing {filteredTransactions.length} of {transactions.length}{" "}
                  transactions
                  {searchQuery && <span> matching "{searchQuery}"</span>}
                </p>
              </div>
            )}
            <TransactionList transactions={paginatedTransactions} />
            {totalPages > 1 && (
              <div className="p-4 border-t border-[var(--color-gray-soft)]">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
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
