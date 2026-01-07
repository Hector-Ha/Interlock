import { useState, useEffect } from "react";
import { useBankStore } from "@/stores/bank.store";
import { bankService } from "@/services/bank.service";
import { transferService } from "@/services/transfer.service";
import type { Account, Transaction } from "@/types/bank";
import type { Transfer } from "@/types/transfer";

interface UseDashboardResult {
  isLoading: boolean;
  error: string | null;
  totalBalance: number;
  recentTransactions: Transaction[];
  pendingTransfers: Transfer[];
  accounts: Account[];
  greeting: string;
}

export const useDashboard = (): UseDashboardResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  // Use local state for total balance since we calculate it from accounts
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const { banks, fetchBanks } = useBankStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await fetchBanks();

        // Obtaining the list directly is safer in this specific async flow to avoid race conditions with store updates.
        const banksResponse = await bankService.getBanks();

        const currentBanks = banksResponse.banks;

        let transactions: Transaction[] = [];
        let calculatedBalance = 0;
        let allAccounts: Account[] = [];

        if (currentBanks.length > 0) {
          // Fetch recent transactions from the first bank as a primary source
          const primaryBankId = currentBanks[0].id;
          if (primaryBankId) {
            const txResponse = await bankService.getTransactions(
              primaryBankId,
              { limit: 5 }
            );
            transactions = txResponse.transactions;
          }

          // Fetch accounts for each bank to calculate total balance and collect accounts
          const accountsPromises = currentBanks.map((bank) =>
            bankService.getAccounts(bank.id)
          );
          const accountsResponses = await Promise.all(accountsPromises);

          accountsResponses.forEach((response) => {
            response.accounts.forEach((account) => {
              allAccounts.push(account);
              calculatedBalance +=
                account.balance.available ?? account.balance.current ?? 0;
            });
          });
        }

        // Fetch pending transfers
        const transfersPromise = transferService.getTransfers({
          status: "PENDING",
          limit: 5,
        });
        const transfersRes = await transfersPromise;

        if (isMounted) {
          setRecentTransactions(transactions);
          setPendingTransfers(transfersRes.transfers || []);
          setTotalBalance(calculatedBalance);
          setAccounts(allAccounts);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Dashboard data load error:", err);
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [fetchBanks]);

  return {
    isLoading,
    error,
    totalBalance,
    recentTransactions,
    pendingTransfers,
    accounts,
    greeting: getGreeting(),
  };
};
