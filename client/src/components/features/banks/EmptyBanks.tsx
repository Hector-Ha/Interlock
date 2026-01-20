"use client";

import { Building2, Plus } from "lucide-react";
import { Button, Card } from "@/components/ui";

interface EmptyBanksProps {
  onAddBank: () => void;
}

export function EmptyBanks({ onAddBank }: EmptyBanksProps) {
  return (
    <Card className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[400px] border-2 border-dashed border-brand-disabled/50 rounded-2xl overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-surface/60 via-transparent to-success-surface/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-main to-brand-hover mb-6 shadow-lg shadow-brand-main/25">
          <Building2 className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          No banks connected yet
        </h3>
        <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
          Connect your bank account to start tracking your expenses and
          transferring money securely.
        </p>
        <Button
          onClick={onAddBank}
          size="lg"
          className="bg-brand-main hover:bg-brand-hover text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Connect Bank
        </Button>
      </div>
    </Card>
  );
}
