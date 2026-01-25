import { create } from "zustand";
import { bankService } from "@/services/bank.service";
import type { Bank, Account } from "@/types/bank";

interface BankState {
  banks: Bank[];
  selectedBank: Bank | null;
  accounts: Account[];
  isLoading: boolean;
  error: string | null;

  fetchBanks: () => Promise<void>;
  selectBank: (bankId: string | null) => Promise<void>;
  fetchAccounts: (bankId: string) => Promise<void>;
  addBank: (bank: Bank) => void;
  removeBank: (bankId: string) => void;
  updateBank: (bankId: string, updates: Partial<Bank>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  banks: [],
  selectedBank: null,
  accounts: [],
  isLoading: false,
  error: null,
};

export const useBankStore = create<BankState>((set, get) => ({
  ...initialState,

  fetchBanks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { banks } = await bankService.getBanks();

      const banksWithAccounts = await Promise.all(
        banks.map(async (bank) => {
          try {
            const { accounts } = await bankService.getAccounts(bank.id);
            return { ...bank, accounts };
          } catch {
            return { ...bank, accounts: [] };
          }
        })
      );

      set({ banks: banksWithAccounts, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch banks";
      set({ isLoading: false, error: message });
    }
  },

  selectBank: async (bankId: string | null) => {
    if (!bankId) {
      set({ selectedBank: null, accounts: [] });
      return;
    }

    const existingBank = get().banks.find((b) => b.id === bankId);
    if (existingBank) {
      set({ selectedBank: existingBank });
    }

    try {
      set({ isLoading: true, error: null });
      const [bankRes, accountsRes] = await Promise.all([
        bankService.getBank(bankId),
        bankService.getAccounts(bankId),
      ]);
      set({
        selectedBank: bankRes.bank,
        accounts: accountsRes.accounts,
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bank details";
      set({ isLoading: false, error: message });
    }
  },

  fetchAccounts: async (bankId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { accounts } = await bankService.getAccounts(bankId);
      set({ accounts, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch accounts";
      set({ isLoading: false, error: message });
    }
  },

  addBank: (bank: Bank) => {
    set((state) => ({
      banks: [...state.banks, bank],
    }));
  },

  removeBank: (bankId: string) => {
    set((state) => ({
      banks: state.banks.filter((b) => b.id !== bankId),
      selectedBank:
        state.selectedBank?.id === bankId ? null : state.selectedBank,
    }));
  },

  updateBank: (bankId: string, updates: Partial<Bank>) => {
    set((state) => ({
      banks: state.banks.map((b) =>
        b.id === bankId ? { ...b, ...updates } : b
      ),
      selectedBank:
        state.selectedBank?.id === bankId
          ? { ...state.selectedBank, ...updates }
          : state.selectedBank,
    }));
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
