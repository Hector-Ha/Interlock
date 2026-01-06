"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import type { Bank } from "@/types/bank";
import { cn } from "@/lib/utils";

interface BankCardProps {
  bank: Bank;
}

export function BankCard({ bank }: BankCardProps) {
  return (
    <Link href={`/banks/${bank.id}`}>
      <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7839EE]/10">
            <CreditCard className="h-5 w-5 text-[#7839EE]" />
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              bank.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {bank.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-slate-900 truncate">
            {bank.institutionName}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Linked on {new Date(bank.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
