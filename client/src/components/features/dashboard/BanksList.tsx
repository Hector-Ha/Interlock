"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Bank } from "@/types/bank";

interface BanksListProps {
  banks: Bank[];
}

export function BanksList({ banks }: BanksListProps) {
  if (banks.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-500">
        No banks connected yet.
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {banks.map((bank) => (
        <Link key={bank.id} href={`/banks/${bank.id}`}>
          <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface border border-brand-soft group-hover:bg-brand-soft transition-colors">
                <CreditCard className="h-6 w-6 text-brand-main" />
              </div>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  bank.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {bank.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-brand-main transition-colors">
                {bank.institutionName}
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                Linked {new Date(bank.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
