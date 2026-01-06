"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { TransferForm } from "@/components/features/transfers/TransferForm";

export default function NewTransferPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Transfer</h1>
          <p className="text-slate-500">
            Initiate a transfer between your accounts
          </p>
        </div>
      </div>

      <TransferForm />
    </div>
  );
}
