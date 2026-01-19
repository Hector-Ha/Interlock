"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search,
  CreditCard,
  ShoppingBag,
  Utensils,
  Car,
  Tv,
  PiggyBank,
  Briefcase,
  Heart,
  Gift,
  Home,
  Loader2,
  X,
} from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { bankService } from "@/services/bank.service";
import type { Bank } from "@/types/bank";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import {
  useTransactionsByCategory,
  type TimePeriod,
} from "@/hooks/useTransactionsByCategory";
import { CategoryTransactionItem } from "@/components/features/sidebar/CategoryTransactionItem";

// Time period options for dropdown
const timePeriodOptions: SelectOption[] = [
  { value: "1week", label: "Last 7 Days" },
  { value: "1month", label: "Last Month" },
  { value: "1year", label: "Last Year" },
  { value: "alltime", label: "All Time" },
];

// Sort options
const sortOptions: SelectOption[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

// Status filter options
const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "SUCCESS", label: "Success" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Food and Drink": <Utensils className="h-4 w-4" />,
  Travel: <Car className="h-4 w-4" />,
  Shops: <ShoppingBag className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Transfer: <CreditCard className="h-4 w-4" />,
  Payment: <CreditCard className="h-4 w-4" />,
  Recreation: <Tv className="h-4 w-4" />,
  Entertainment: <Tv className="h-4 w-4" />,
  Service: <Briefcase className="h-4 w-4" />,
  Healthcare: <Heart className="h-4 w-4" />,
  Community: <Gift className="h-4 w-4" />,
  "Bank Fees": <Home className="h-4 w-4" />,
  Interest: <PiggyBank className="h-4 w-4" />,
  Tax: <Briefcase className="h-4 w-4" />,
};

function getCategoryIcon(category: string): React.ReactNode {
  if (categoryIcons[category]) return categoryIcons[category];
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return <CreditCard className="h-4 w-4" />;
}

// Server transaction type
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

  // Transaction list state per bank
  const [bankTransactions, setBankTransactions] = useState<BankTransactions[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBankTab, setSelectedBankTab] = useState<string>("all");

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Fetch transactions for each bank
  const fetchAllTransactions = useCallback(async () => {
    if (banks.length === 0) {
      setBankTransactions([]);
      return;
    }

    // Initialize loading state for all banks
    setBankTransactions(
      banks.map((bank) => ({
        bankId: bank.id,
        bankName: bank.institutionName,
        transactions: [],
        isLoading: true,
        error: null,
      })),
    );

    // Fetch in parallel
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
  }, [banks]);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  // Filter and sort transactions
  const getFilteredTransactions = useCallback(
    (transactions: ServerTransaction[]) => {
      let filtered = [...transactions];

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((tx) => tx.status === statusFilter);
      }

      // Apply search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (tx) =>
            tx.name.toLowerCase().includes(query) ||
            tx.merchantName?.toLowerCase().includes(query) ||
            tx.category?.toLowerCase().includes(query),
        );
      }

      // Apply sort
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

  // Get bank tabs
  const bankTabs = useMemo(() => {
    const tabs: SelectOption[] = [{ value: "all", label: "All Banks" }];
    banks.forEach((bank) => {
      tabs.push({ value: bank.id, label: bank.institutionName });
    });
    return tabs;
  }, [banks]);

  // Get visible banks based on tab
  const visibleBankTransactions = useMemo(() => {
    if (selectedBankTab === "all") return bankTransactions;
    return bankTransactions.filter((bt) => bt.bankId === selectedBankTab);
  }, [bankTransactions, selectedBankTab]);

  const hasAnyTransactions = bankTransactions.some(
    (bt) => bt.transactions.length > 0,
  );
  const isLoadingTransactions = bankTransactions.some((bt) => bt.isLoading);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground">
          View and analyze your transaction history across all banks
        </p>
      </div>

      {/* Section 1: Category Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Spending by Category
          </CardTitle>
          <div className="w-36">
            <Select
              options={timePeriodOptions}
              value={timePeriod}
              onChange={(v) => setTimePeriod(v as TimePeriod)}
              placeholder="Period"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isCategoryLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : banks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No banks linked yet</p>
            </div>
          ) : categorySummary.every((b) => b.categories.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try selecting a different time period
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categorySummary.map((bankData, bankIndex) => {
                if (bankData.categories.length === 0) return null;
                return (
                  <div
                    key={bankData.bankId}
                    className="rounded-xl border border-border p-4"
                  >
                    <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {bankData.bankName}
                    </h4>
                    <div className="divide-y divide-border">
                      {bankData.categories.slice(0, 5).map((cat, idx) => (
                        <CategoryTransactionItem
                          key={`${bankData.bankId}-${cat.category}`}
                          index={bankIndex * 5 + idx}
                          icon={getCategoryIcon(cat.category)}
                          label={cat.category}
                          positiveAmount={
                            cat.income > 0 ? cat.income : undefined
                          }
                          negativeAmount={
                            cat.expense > 0 ? cat.expense : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Detailed Transactions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg font-semibold">
              Transaction Details
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="w-32">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Status"
                />
              </div>

              {/* Sort */}
              <div className="w-40">
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                />
              </div>
            </div>
          </div>

          {/* Bank Tabs */}
          {banks.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {bankTabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={
                    selectedBankTab === tab.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedBankTab(tab.value)}
                  className="whitespace-nowrap"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : banks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No banks linked yet</p>
            </div>
          ) : !hasAnyTransactions ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Sync your banks to see transactions
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {visibleBankTransactions.map((bankData) => {
                const filtered = getFilteredTransactions(bankData.transactions);

                if (bankData.isLoading) {
                  return (
                    <div key={bankData.bankId} className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Loading {bankData.bankName}...
                        </span>
                      </div>
                    </div>
                  );
                }

                if (bankData.error) {
                  return (
                    <div key={bankData.bankId} className="p-6">
                      <div className="text-sm text-error-main">
                        Failed to load {bankData.bankName}: {bankData.error}
                      </div>
                    </div>
                  );
                }

                if (filtered.length === 0 && selectedBankTab === "all") {
                  return null; // Skip empty banks in "all" view
                }

                return (
                  <div key={bankData.bankId}>
                    {/* Bank Header */}
                    {selectedBankTab === "all" && (
                      <div className="bg-muted/50 px-6 py-3 border-b border-border">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {bankData.bankName}
                          <Badge variant="secondary" className="ml-2">
                            {filtered.length} transactions
                          </Badge>
                        </h4>
                      </div>
                    )}

                    {/* Transactions Table */}
                    {filtered.length === 0 ? (
                      <div className="px-6 py-8 text-center text-muted-foreground">
                        No matching transactions
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/30">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filtered.slice(0, 20).map((tx) => (
                              <tr
                                key={tx.id}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                      {getCategoryIcon(tx.category || "Other")}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-foreground">
                                        {tx.name}
                                      </div>
                                      {tx.merchantName && (
                                        <div className="text-xs text-muted-foreground">
                                          {tx.merchantName}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-muted-foreground">
                                    {tx.category || "Uncategorized"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(tx.date)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge
                                    variant={
                                      tx.status === "SUCCESS"
                                        ? "success"
                                        : tx.status === "PENDING"
                                          ? "secondary"
                                          : "error"
                                    }
                                  >
                                    {tx.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <span className="text-sm font-medium text-foreground">
                                    ${tx.amount.toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filtered.length > 20 && (
                          <div className="px-6 py-3 text-center text-sm text-muted-foreground border-t border-border">
                            Showing 20 of {filtered.length} transactions
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
