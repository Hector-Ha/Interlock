import { useState, useEffect, useCallback } from "react";
import { bankService } from "@/services/bank.service";
import type { Bank } from "@/types/bank";

export type TimePeriod = "1week" | "1month" | "1year" | "alltime";

export interface CategorySummary {
  category: string;
  income: number;
  expense: number;
}

export interface BankTransactionSummary {
  bankId: string;
  bankName: string;
  categories: CategorySummary[];
  totalIncome: number;
  totalExpense: number;
}

interface UseTransactionsByCategoryResult {
  data: BankTransactionSummary[];
  isLoading: boolean;
  error: string | null;
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
  refetch: () => Promise<void>;
}

// Transaction response from server (category is a string, not array)
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

/**
 * Calculate date range based on time period.
 * Returns ISO 8601 datetime strings for API compatibility.
 */
function getDateRange(period: TimePeriod): {
  startDate?: string;
  endDate?: string;
} {
  const now = new Date();
  // End of today
  now.setHours(23, 59, 59, 999);
  const endDate = now.toISOString();

  switch (period) {
    case "1week": {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { startDate: start.toISOString(), endDate };
    }
    case "1month": {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      return { startDate: start.toISOString(), endDate };
    }
    case "1year": {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      return { startDate: start.toISOString(), endDate };
    }
    case "alltime":
    default:
      return {}; // No date filter
  }
}

/**
 * Group transactions by category and calculate income/expense.
 * Note: In Plaid, positive amounts = money leaving (expense),
 * negative amounts = money entering (income).
 */
function groupByCategory(transactions: ServerTransaction[]): CategorySummary[] {
  const categoryMap = new Map<string, { income: number; expense: number }>();

  for (const tx of transactions) {
    // Use category or "Uncategorized"
    const category = tx.category || "Uncategorized";

    if (!categoryMap.has(category)) {
      categoryMap.set(category, { income: 0, expense: 0 });
    }

    const summary = categoryMap.get(category)!;

    // The server stores Math.abs(amount), but we can infer from pending status
    // Actually after reviewing sync logic: all amounts are stored as positive
    // We'll treat all as expenses for now (most common case)
    // A proper solution would track the original sign from Plaid
    summary.expense += Math.abs(tx.amount);
  }

  // Convert to array and sort by total activity (highest first)
  return Array.from(categoryMap.entries())
    .map(([category, { income, expense }]) => ({
      category,
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
    }))
    .sort((a, b) => b.expense + b.income - (a.expense + a.income));
}

/**
 * Hook to fetch and aggregate transactions by category for all banks.
 * Uses async-parallel pattern from best practices for concurrent fetching.
 */
export function useTransactionsByCategory(
  banks: Bank[],
): UseTransactionsByCategoryResult {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");
  const [data, setData] = useState<BankTransactionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (banks.length === 0) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(timePeriod);

      // Fetch transactions for all banks in parallel (async-parallel pattern)
      const results = await Promise.all(
        banks.map(async (bank) => {
          try {
            // Don't filter by status - let server return all, we'll filter client-side
            const response = await bankService.getTransactions(bank.id, {
              startDate,
              endDate,
              limit: 100, // Reasonable limit for sidebar display
            });

            // Type assertion since server returns different format
            const serverTx =
              response.transactions as unknown as ServerTransaction[];

            // Filter to only SUCCESS transactions on client side
            const successTx = serverTx.filter((tx) => tx.status === "SUCCESS");

            const categories = groupByCategory(successTx);
            const totalIncome = categories.reduce(
              (sum, c) => sum + c.income,
              0,
            );
            const totalExpense = categories.reduce(
              (sum, c) => sum + c.expense,
              0,
            );

            return {
              bankId: bank.id,
              bankName: bank.institutionName,
              categories,
              totalIncome: Math.round(totalIncome * 100) / 100,
              totalExpense: Math.round(totalExpense * 100) / 100,
            };
          } catch (err) {
            // Log detailed error for debugging
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error";
            console.warn(
              `[useTransactionsByCategory] Bank ${bank.institutionName} (${bank.id}): ${errorMessage}`,
            );

            // Return empty data for this bank, don't fail entire request
            return {
              bankId: bank.id,
              bankName: bank.institutionName,
              categories: [],
              totalIncome: 0,
              totalExpense: 0,
            };
          }
        }),
      );

      setData(results);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch transactions";
      setError(message);
      console.error("[useTransactionsByCategory] Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [banks, timePeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    timePeriod,
    setTimePeriod,
    refetch: fetchData,
  };
}
