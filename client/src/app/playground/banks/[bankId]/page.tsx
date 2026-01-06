"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import BankDetailsPage from "@/app/(root)/banks/[bankId]/page";
import { useBankStore } from "@/stores/bank.store";
import { type Bank } from "@/types/bank";
import { bankService } from "@/services/bank.service";

// Mock Data
const MOCK_BANK: Bank = {
  id: "bank_1",
  userId: "user_1",
  itemId: "item_1",
  institutionId: "ins_1",
  institutionName: "Chase Bank",
  status: "ACTIVE",
  lastSyncedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dwollaFundingUrl: null,
  isDwollaLinked: false,
};

const MOCK_ACCOUNTS = [
  {
    id: "acc_1",
    userId: "user_1",
    name: "Total Checking",
    officialName: "Chase Total Checking",
    mask: "1234",
    type: "depository",
    subtype: "checking",
    balance: {
      current: 5240.5,
      available: 5240.5,
      limit: null,
      currency: "USD",
    },
  },
  {
    id: "acc_2",
    userId: "user_1",
    name: "Platinum Savings",
    officialName: "Chase Platinum Savings",
    mask: "5678",
    type: "depository",
    subtype: "savings",
    balance: {
      current: 12500.0,
      available: 12500.0,
      limit: null,
      currency: "USD",
    },
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "tx_1",
    accountId: "acc_1",
    userId: "user_1",
    bankId: "bank_1",
    amount: 54.2,
    date: new Date().toISOString(),
    name: "Uber Ride",
    category: ["Travel", "Taxi"],
    pending: false,
    status: "PROCESSING",
    channel: "online",
  },
  {
    id: "tx_2",
    accountId: "acc_1",
    userId: "user_1",
    bankId: "bank_1",
    amount: -2500.0,
    date: new Date(Date.now() - 86400000).toISOString(),
    name: "Paycheck Deposit",
    category: ["Transfer", "Deposit"],
    pending: false,
    status: "SUCCESS",
    channel: "other",
  },
  {
    id: "tx_3",
    accountId: "acc_1",
    userId: "user_1",
    bankId: "bank_1",
    amount: 12.99,
    date: new Date(Date.now() - 172800000).toISOString(),
    name: "Netflix Subscription",
    category: ["Entertainment"],
    pending: true,
    status: "PENDING",
    channel: "online",
  },
  {
    id: "tx_4",
    accountId: "acc_1",
    userId: "user_1",
    bankId: "bank_1",
    amount: 45.0,
    date: new Date(Date.now() - 250000000).toISOString(),
    name: "Failed Payment",
    category: ["Shops"],
    pending: false,
    status: "FAILED",
    channel: "online",
  },
  {
    id: "tx_5",
    accountId: "acc_1",
    userId: "user_1",
    bankId: "bank_1",
    amount: 120.0,
    date: new Date(Date.now() - 300000000).toISOString(),
    name: "Returned Purchase",
    category: ["Shops"],
    pending: false,
    status: "RETURNED",
    channel: "store",
  },
];

export default function PlaygroundBankDetailsPage() {
  const params = useParams();
  const bankId = params?.bankId as string;

  useEffect(() => {
    // Mock the service calls for this specific page
    const originalGetBank = bankService.getBank;
    const originalGetAccounts = bankService.getAccounts;
    const originalGetTransactions = bankService.getTransactions;

    bankService.getBank = async (id) => {
      return { bank: { ...MOCK_BANK, id } };
    };

    bankService.getAccounts = async (id) => {
      return {
        accounts: MOCK_ACCOUNTS as unknown as any[], // Casting to avoid strict type checks on mock data
        institutionName: "Chase Bank",
        lastUpdated: new Date().toISOString(),
      };
    };

    bankService.getTransactions = async (id) => {
      return {
        transactions: MOCK_TRANSACTIONS as unknown as any[],
        pagination: {
          total: MOCK_TRANSACTIONS.length,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      };
    };

    useBankStore.setState({ banks: [{ ...MOCK_BANK, id: bankId }] });

    return () => {
      bankService.getBank = originalGetBank;
      bankService.getAccounts = originalGetAccounts;
      bankService.getTransactions = originalGetTransactions;
      useBankStore.setState({ banks: [] });
    };
  }, [bankId]);

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-slate-100 p-4 rounded-lg mb-8 border border-slate-200">
          <p className="text-sm text-slate-500 font-mono">
            Route: /playground/banks/{bankId} (Mock Data)
          </p>
        </div>
        <BankDetailsPage />
      </div>
    </AppShell>
  );
}
