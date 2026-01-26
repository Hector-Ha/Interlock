"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useBankStore } from "@/stores/bank.store";
import { bankService } from "@/services/bank.service";
import { Card } from "@/components/ui/Card";
import { TransactionsHeader } from "@/components/features/transactions/TransactionsHeader";
import { TransactionFilters } from "@/components/features/transactions/TransactionFilters";
import { TransactionTable } from "@/components/features/transactions/TransactionTable";
import { CategorySummaryCard } from "@/components/features/transactions/CategorySummaryCard";
import { TransactionsPageSkeleton } from "@/components/features/transactions/TransactionsSkeleton";
import {
  useTransactionsByCategory,
  type TimePeriod,
} from "@/hooks/useTransactionsByCategory";
import type { SelectOption } from "@/components/ui/Select";

interface ServerTransaction {
  id: string;
  amount: number;
  name: string;
  merchantName: string | null;
  date: string;
  status: string;
  category: string | null;
  channel: string;
  pending: boolean;
}

interface BankTransactions {
  bankId: string;
  bankName: string;
  transactions: ServerTransaction[];
  isLoading: boolean;
  error: string | null;
}

export default function TransactionsPage() {
  const { banks, fetchBanks } = useBankStore();
  const {
    data: categorySummary,
    timePeriod,
    setTimePeriod,
    isLoading: isCategoryLoading,
  } = useTransactionsByCategory(banks);

  const [bankTransactions, setBankTransactions] = useState<BankTransactions[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBankTab, setSelectedBankTab] = useState<string>("all");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const fetchAllTransactions = useCallback(async () => {
    if (banks.length === 0) {
      setBankTransactions([]);
      setIsInitialLoading(false);
      return;
    }

    setBankTransactions(
      banks.map((bank) => ({
        bankId: bank.id,
        bankName: bank.institutionName,
        transactions: [],
        isLoading: true,
        error: null,
      })),
    );

    const results = await Promise.all(
      banks.map(async (bank) => {
        try {
          const response = await bankService.getTransactions(bank.id, {
            limit: 100,
          });
          return {
            bankId: bank.id,
            bankName: bank.institutionName,
            transactions:
              response.transactions as unknown as ServerTransaction[],
            isLoading: false,
            error: null,
          };
        } catch (err) {
          return {
            bankId: bank.id,
            bankName: bank.institutionName,
            transactions: [],
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to load",
          };
        }
      }),
    );

    setBankTransactions(results);
    setIsInitialLoading(false);
  }, [banks]);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  const getFilteredTransactions = useCallback(
    (transactions: ServerTransaction[]) => {
      let filtered = [...transactions];

      if (statusFilter !== "all") {
        filtered = filtered.filter((tx) => tx.status === statusFilter);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (tx) =>
            tx.name.toLowerCase().includes(query) ||
            tx.merchantName?.toLowerCase().includes(query) ||
            tx.category?.toLowerCase().includes(query),
        );
      }

      const [field, direction] = sortBy.split("-");
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (field) {
          case "date":
            comparison =
              new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
        }
        return direction === "desc" ? -comparison : comparison;
      });

      return filtered;
    },
    [searchQuery, sortBy, statusFilter],
  );

  const bankTabs = useMemo(() => {
    const tabs: SelectOption[] = [{ value: "all", label: "All Banks" }];
    banks.forEach((bank) => {
      tabs.push({ value: bank.id, label: bank.institutionName });
    });
    return tabs;
  }, [banks]);

  const visibleBankTransactions = useMemo(() => {
    if (selectedBankTab === "all") return bankTransactions;
    return bankTransactions.filter((bt) => bt.bankId === selectedBankTab);
  }, [bankTransactions, selectedBankTab]);

  // Calculate totals
  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    bankTransactions.forEach((bt) => {
      bt.transactions.forEach((tx) => {
        if (tx.amount > 0) {
          expense += tx.amount;
        } else {
          income += Math.abs(tx.amount);
        }
      });
    });
    return { totalIncome: income, totalExpense: expense };
  }, [bankTransactions]);

  const isLoadingTransactions = bankTransactions.some((bt) => bt.isLoading);

  if (isInitialLoading) {
    return <TransactionsPageSkeleton />;
  }

  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Header with Stats */}
          <TransactionsHeader
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Left: Category Summary */}
            <div className="xl:col-span-4">
              <CategorySummaryCard
                data={categorySummary}
                isLoading={isCategoryLoading}
                timePeriod={timePeriod}
                onTimePeriodChange={(v) => setTimePeriod(v as TimePeriod)}
              />
            </div>

            {/* Right: Transaction Table */}
            <div className="xl:col-span-8">
              <Card
                padding="none"
                className="overflow-hidden border-[var(--color-gray-soft)]"
              >
                {/* Filters */}
                <div className="p-5 lg:p-6 border-b border-[var(--color-gray-soft)]">
                  <TransactionFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    bankTabs={bankTabs}
                    selectedBankTab={selectedBankTab}
                    onBankTabChange={setSelectedBankTab}
                  />
                </div>

                {/* Transactions */}
                {visibleBankTransactions.map((bankData) => {
                  const filtered = getFilteredTransactions(
                    bankData.transactions,
                  );

                  if (
                    bankData.isLoading ||
                    bankData.error ||
                    filtered.length === 0
                  ) {
                    if (
                      selectedBankTab !== "all" ||
                      bankData.isLoading ||
                      bankData.error
                    ) {
                      return (
                        <TransactionTable
                          key={bankData.bankId}
                          transactions={filtered}
                          bankName={bankData.bankName}
                          isLoading={bankData.isLoading}
                          error={bankData.error}
                          searchQuery={searchQuery}
                          totalOriginalCount={bankData.transactions.length}
                        />
                      );
                    }
                    return null;
                  }

                  return (
                    <TransactionTable
                      key={bankData.bankId}
                      transactions={filtered}
                      bankName={bankData.bankName}
                      showBankHeader={
                        selectedBankTab === "all" && banks.length > 1
                      }
                      searchQuery={searchQuery}
                      totalOriginalCount={bankData.transactions.length}
                    />
                  );
                })}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
