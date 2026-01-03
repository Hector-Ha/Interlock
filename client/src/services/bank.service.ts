import { api } from "./api-client";
import type { Bank, Account, Transaction } from "@/types/bank";

export interface AccountsResponse {
  accounts: Account[];
  institutionName: string;
  lastUpdated: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface TransactionFilters {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
}

export interface SyncResult {
  added: number;
  modified: number;
  removed: number;
}

export interface LinkDwollaData {
  bankId: string;
  accountId: string;
}

export const bankService = {
  getBanks: async (): Promise<{ banks: Bank[] }> => {
    return api.get<{ banks: Bank[] }>("/bank");
  },

  getBank: async (bankId: string): Promise<{ bank: Bank }> => {
    return api.get<{ bank: Bank }>(`/bank/${bankId}`);
  },

  getAccounts: async (bankId: string): Promise<AccountsResponse> => {
    return api.get<AccountsResponse>(`/bank/${bankId}/accounts`);
  },

  getAccountBalance: async (
    bankId: string,
    accountId: string
  ): Promise<{
    accountId: string;
    balance: Account["balance"];
    lastUpdated: string;
  }> => {
    return api.get(`/bank/${bankId}/accounts/${accountId}/balance`);
  },

  getTransactions: async (
    bankId: string,
    filters?: TransactionFilters
  ): Promise<TransactionsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    return api.get<TransactionsResponse>(
      `/bank/${bankId}/transactions${params.toString() ? `?${params}` : ""}`
    );
  },

  syncTransactions: async (
    bankId: string
  ): Promise<{ message: string; result: SyncResult }> => {
    return api.post(`/bank/${bankId}/sync`);
  },

  linkWithDwolla: async (
    data: LinkDwollaData
  ): Promise<{ message: string; fundingSourceUrl: string }> => {
    return api.post("/bank/link-dwolla", data);
  },

  disconnectBank: async (bankId: string): Promise<{ message: string }> => {
    return api.delete(`/bank/${bankId}`);
  },
};
