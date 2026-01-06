"use client";

import { CreditCard } from "lucide-react";
import type { Account } from "@/services/bank.service";
import { formatCurrency } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";

interface AccountCardProps {
  account: Account;
  bankId: string;
}

export function AccountCard({ account, bankId }: AccountCardProps) {
  return (
    <Card className="flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-surface flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-brand-main" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 line-clamp-1">
              {account.name}
            </h3>
            <p className="text-sm text-slate-500">****{account.mask}</p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {account.subtype}
        </Badge>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-slate-500">Current Balance</p>
        <p className="text-xl font-bold font-google-sans text-slate-900">
          {formatCurrency(account.balance.current || 0)}
        </p>
      </div>
    </Card>
  );
}
