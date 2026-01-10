"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRightLeft, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { TransferForm } from "@/components/features/transfers/TransferForm";
import { P2PTransferForm } from "@/components/features/transfers/P2PTransferForm";

type TransferType = "internal" | "p2p";

export default function NewTransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transferType, setTransferType] = useState<TransferType>("internal");

  // Read ?type=p2p query param on mount
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "p2p") {
      setTransferType("p2p");
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Transfer</h1>
          <p className="text-slate-500">
            {transferType === "internal"
              ? "Move money between your accounts"
              : "Send money to another user"}
          </p>
        </div>
      </div>

      {/* Transfer Type Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setTransferType("internal")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            transferType === "internal"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          Between My Accounts
        </button>
        <button
          onClick={() => setTransferType("p2p")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            transferType === "p2p"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Send className="h-4 w-4" />
          Send to User
        </button>
      </div>

      {/* Form based on selected type */}
      {transferType === "internal" ? <TransferForm /> : <P2PTransferForm />}
    </div>
  );
}
