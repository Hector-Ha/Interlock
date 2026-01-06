"use client";

import { Building2, Plus } from "lucide-react";
import { Button, Card } from "@/components/ui";

interface EmptyBanksProps {
  onAddBank: () => void;
}

export function EmptyBanks({ onAddBank }: EmptyBanksProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-6">
        <Building2 className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No banks connected yet
      </h3>
      <p className="text-slate-500 max-w-sm mb-8">
        Connect your bank account to start tracking your expenses and
        transferring money securely.
      </p>
      <Button onClick={onAddBank} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Connect Bank
      </Button>
    </Card>
  );
}
