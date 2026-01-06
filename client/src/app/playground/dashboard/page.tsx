"use strict";
"use client";

import React from "react";
import HeaderBox from "@/components/shared/HeaderBox";
import { BanksList } from "@/components/features/dashboard/BanksList";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { QuickActions } from "@/components/features/dashboard/QuickActions";
import { TotalBalanceCard } from "@/components/features/dashboard/TotalBalanceCard";
import { AppShell } from "@/components/layout/AppShell";

const DashboardPlaygroundPage = () => {
  // Mock Data
  const user = { firstName: "Playground User" };
  const totalBalance = 12500.55;
  const greeting = "Good Afternoon";

  // Mock Accounts aligned with TotalBalanceCard props
  const accounts = [
    {
      id: "1",
      appwriteItemId: "1",
      name: "Chase Checking",
      officialName: "Chase Checking",
      mask: "1234",
      institutionId: "ins_1",
      balance: { current: 5000, available: 5000 },
    } as any,
    {
      id: "2",
      appwriteItemId: "2",
      name: "Citi Savings",
      officialName: "Citi Savings",
      mask: "5678",
      institutionId: "ins_2",
      balance: { current: 4000, available: 4000 },
    } as any,
    {
      id: "3",
      appwriteItemId: "3",
      name: "Amex Gold",
      officialName: "American Express Gold",
      mask: "9012",
      institutionId: "ins_3",
      balance: { current: 3500.55, available: 3500.55 },
    } as any,
  ];

  // Mock Banks aligned with BanksList props
  const banks = [
    {
      id: "1",
      institutionName: "Chase Bank",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    } as any,
    {
      id: "2",
      institutionName: "Citi Bank",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    } as any,
  ];

  // Mock Transactions aligned with RecentTransactions props
  const recentTransactions = [
    {
      id: "1",
      name: "Starbucks",
      amount: 5.5,
      date: new Date().toISOString(),
      status: "SUCCESS",
      category: "Food and Drink",
      paymentChannel: "online",
      type: "debit",
      accountId: "1",
      image: "",
    } as any,
    {
      id: "2",
      name: "Uber",
      amount: 25.0,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "PENDING",
      category: "Travel",
      paymentChannel: "online",
      type: "debit",
      accountId: "1",
      image: "",
    } as any,
    {
      id: "3",
      name: "Amazon",
      amount: 120.99,
      date: new Date(Date.now() - 172800000).toISOString(),
      status: "SUCCESS",
      category: "Shopping",
      paymentChannel: "online",
      type: "debit",
      accountId: "2",
      image: "",
    } as any,
    {
      id: "4",
      name: "Deposit",
      amount: 5000.0,
      date: new Date(Date.now() - 259200000).toISOString(),
      status: "SUCCESS",
      category: "Income",
      paymentChannel: "online",
      type: "credit",
      accountId: "1",
      image: "",
    } as any,
    {
      id: "5",
      name: "Netflix",
      amount: 15.99,
      date: new Date(Date.now() - 345600000).toISOString(),
      status: "PROCESSING",
      category: "Entertainment",
      paymentChannel: "online",
      type: "debit",
      accountId: "1",
      image: "",
    } as any,
  ];

  return (
    <AppShell>
      <section className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-12">
          <header className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="w-full md:max-w-xl">
              <HeaderBox
                type="greeting"
                title={greeting}
                user={user.firstName}
                subtext="Access and manage your account and transactions efficiently."
              />
            </div>

            <div className="w-full md:max-w-[400px]">
              <TotalBalanceCard
                totalCurrentBalance={totalBalance}
                accounts={accounts}
                totalBanks={banks.length}
              />
            </div>
          </header>

          <QuickActions hasBanks={banks.length > 0} />

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">My Banks</h3>
              <BanksList banks={banks} />
            </div>

            <div className="space-y-6">
              <RecentTransactions transactions={recentTransactions} />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default DashboardPlaygroundPage;
