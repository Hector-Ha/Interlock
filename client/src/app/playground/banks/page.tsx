"use client";

import { useEffect } from "react";
import BanksPage from "@/app/(root)/banks/page";
import { AppShell } from "@/components/layout/AppShell";
import { useBankStore } from "@/stores/bank.store";
import type { Bank } from "@/types/bank";

const MOCK_BANKS: Bank[] = [
  {
    id: "bank_1",
    userId: "user_1",
    itemId: "item_1",
    institutionId: "ins_1",
    institutionName: "Chase Bank",
    status: "ACTIVE",
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date().toISOString(),
    dwollaFundingUrl: null,
    isDwollaLinked: false,
  },
  {
    id: "bank_2",
    userId: "user_1",
    itemId: "item_2",
    institutionId: "ins_2",
    institutionName: "Bank of America",
    status: "ACTIVE",
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date().toISOString(),
    dwollaFundingUrl: null,
    isDwollaLinked: false,
  },
  {
    id: "bank_3",
    userId: "user_1",
    itemId: "item_3",
    institutionId: "ins_3",
    institutionName: "Wells Fargo",
    status: "LOGIN_REQUIRED",
    lastSyncedAt: new Date("2024-03-10").toISOString(),
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date().toISOString(),
    dwollaFundingUrl: null,
    isDwollaLinked: false,
  },
  {
    id: "bank_4",
    userId: "user_1",
    itemId: "item_4",
    institutionId: "ins_4",
    institutionName: "Citi",
    status: "ACTIVE",
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date("2024-04-20").toISOString(),
    updatedAt: new Date().toISOString(),
    dwollaFundingUrl: null,
    isDwollaLinked: false,
  },
  {
    id: "bank_5",
    userId: "user_1",
    itemId: "item_5",
    institutionId: "ins_5",
    institutionName: "Capital One",
    status: "ACTIVE",
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date("2024-05-05").toISOString(),
    updatedAt: new Date().toISOString(),
    dwollaFundingUrl: null,
    isDwollaLinked: false,
  },
];

export default function PlaygroundBanksPage() {
  const { title } = { title: "Bank Playground" };

  useEffect(() => {
    // Seed the store with mock data
    useBankStore.setState({ banks: MOCK_BANKS, isLoading: false });

    // Cleanup on unmount
    return () => {
      useBankStore.setState({ banks: [] });
    };
  }, []);

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-slate-100 p-4 rounded-lg mb-8 border border-slate-200">
          <p className="text-sm text-slate-500 font-mono">
            Route: /playground/banks (Mock Data: 5 Banks)
          </p>
          <p className="text-xs text-slate-400 mt-1">
            This page uses mocked data for visualization purposes.
          </p>
        </div>
        <BanksPage />
      </div>
    </AppShell>
  );
}
