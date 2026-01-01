import apiClient from "./api-client";
import { Bank, Account, Transaction } from "@/types/bank";

export const bankService = {
  // Get all linked banks for the current user
  async getBanks() {
    const response = await apiClient.get<{ banks: Bank[] }>("/banks");
    return response.data;
  },

  // Get details for a specific bank
  async getBank(bankId: string) {
    const response = await apiClient.get<{ bank: Bank }>(`/banks/${bankId}`);
    return response.data;
  },

  // Get accounts for a specific bank
  async getAccounts(bankId: string) {
    const response = await apiClient.get<{ accounts: Account[] }>(
      `/banks/${bankId}/accounts`
    );
    return response.data;
  },

  // Get transactions for a specific bank or account
  async getTransactions(bankId: string) {
    const response = await apiClient.get<{ transactions: Transaction[] }>(
      `/banks/${bankId}/transactions`
    );
    return response.data;
  },

  // Get recent transactions (cross-bank)
  async getRecentTransactions() {
    const response = await apiClient.get<{ transactions: Transaction[] }>(
      "/banks/recent-transactions"
    );
    return response.data;
  },
};
