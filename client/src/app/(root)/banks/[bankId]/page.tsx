"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import {
  bankService,
  type Account,
  type Transaction,
} from "@/services/bank.service";
import { useBankStore } from "@/stores/bank.store";
import { useToast } from "@/stores/ui.store";
import {
  Button,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui";
import { AccountCard } from "@/components/features/banks/AccountCard";
import { TransactionList } from "@/components/features/transactions/TransactionList";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Spinner } from "@/components/ui/Spinner";

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

      // Refresh transactions
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
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500">Loading bank details...</p>
      </div>
    );
  }

  if (error || !selectedBank) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Alert variant="error">
          <AlertTitle>Error Loading Bank</AlertTitle>
          <AlertDescription>{error || "Bank not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {selectedBank.institutionName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  selectedBank.status === "ACTIVE" ? "success" : "warning"
                }
              >
                {selectedBank.status}
              </Badge>
              {selectedBank.isDwollaLinked && (
                <Badge variant="info">Transfers Enabled</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
            />
            Sync
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>

      {/* Accounts */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Accounts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} bankId={bankId} />
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Transactions
        </h2>
        <TransactionList transactions={transactions} />
      </section>

      {/* Disconnect Confirmation */}
      <ConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Disconnect Bank via Plaid"
        description="Are you sure you want to disconnect this bank? All transaction history and accounts associated with this connection will be removed. This action cannot be undone."
        confirmText="Disconnect Forever"
        onConfirm={handleDisconnect}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
