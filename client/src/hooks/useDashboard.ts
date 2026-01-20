import { useState, useEffect, useCallback } from "react";
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
  refresh: () => Promise<void>;
}

export const useDashboard = (): UseDashboardResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  // Use local state for total balance since we calculate it from accounts
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const { banks, fetchBanks } = useBankStore();

  // Defer greeting calculation to client-side to avoid hydration mismatch
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  /**
   * Loads dashboard data with support for cleanup to prevent race conditions.
   * @param shouldIgnore - Callback to check if the request should be ignored (component unmounted)
   */
  const loadDashboardData = useCallback(
    async (shouldIgnore?: () => boolean) => {
      try {
        setIsLoading(true);
        setError(null);

        await fetchBanks();

        // Check if component unmounted during fetchBanks
        if (shouldIgnore?.()) return;

        // Obtaining the list directly is safer in this specific async flow to avoid race conditions with store updates.
        const banksResponse = await bankService.getBanks();

        // Check if component unmounted during getBanks
        if (shouldIgnore?.()) return;

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
              { limit: 5 },
            );
            transactions = txResponse.transactions;
          }

          // Check if component unmounted during transaction fetch
          if (shouldIgnore?.()) return;

          // Fetch accounts for each bank to calculate total balance and collect accounts
          const accountsPromises = currentBanks.map((bank) =>
            bankService.getAccounts(bank.id),
          );
          const accountsResponses = await Promise.all(accountsPromises);

          // Check if component unmounted during accounts fetch
          if (shouldIgnore?.()) return;

          accountsResponses.forEach((response) => {
            response.accounts.forEach((account) => {
              allAccounts.push(account);
              calculatedBalance +=
                account.balance.available ?? account.balance.current ?? 0;
            });
          });
        }

        // Fetch pending transfers
        const transfersRes = await transferService.getTransfers({
          status: "PENDING",
          limit: 5,
        });

        // Final check before updating state
        if (shouldIgnore?.()) return;

        setRecentTransactions(transactions);
        setPendingTransfers(transfersRes.transfers || []);
        setTotalBalance(calculatedBalance);
        setAccounts(allAccounts);
      } catch (err: unknown) {
        // Don't update error state if component is unmounted
        if (shouldIgnore?.()) return;

        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        console.error("Dashboard data load error:", err);
        setError(errorMessage);
      } finally {
        // Don't update loading state if component is unmounted
        if (!shouldIgnore?.()) {
          setIsLoading(false);
        }
      }
    },
    [fetchBanks],
  );

  useEffect(() => {
    // Flag to track if component is still mounted (prevents race conditions)
    // Note: For even more robustness, AbortController could be used to cancel pending requests
    let ignore = false;

    loadDashboardData(() => ignore);

    // Cleanup function: Mark as ignored to prevent state updates after unmount
    return () => {
      ignore = true;
    };
  }, [loadDashboardData]);

  return {
    isLoading,
    error,
    totalBalance,
    recentTransactions,
    pendingTransfers,
    accounts,
    greeting,
    refresh: () => loadDashboardData(),
  };
};
