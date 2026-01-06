"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { TransferForm } from "@/components/features/transfers/TransferForm";
import { Card, Button } from "@/components/ui";
import { useBankStore } from "@/stores/bank.store";
import { MOCK_BANKS } from "@/lib/mock-data";

export default function PlaygroundTransferPage() {
  // We can access the store directly to seed data
  useEffect(() => {
    // Seed hydration with mock data
    useBankStore.setState({ banks: MOCK_BANKS, isLoading: false });

    // Cleanup: Reset store when leaving playground to avoid polluting real app state
    return () => {
      useBankStore.getState().reset();
    };
  }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Transfer Playground
          </h1>
          <p className="text-slate-500">
            Testing the "New Transfer" page flow with mock data.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="border border-dashed border-slate-300 rounded-lg p-8 bg-white/50">
              <p className="text-xs font-mono text-slate-400 mb-4 text-center">
                --- COMPONENT PREVIEW ---
              </p>

              <div className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" size="icon" disabled>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      New Transfer
                    </h1>
                    <p className="text-slate-500">
                      Initiate a transfer between your accounts
                    </p>
                  </div>
                </div>

                <TransferForm />
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Mock Data Active</h3>
              <p className="text-sm text-slate-600 mb-4">
                The bank store has been seeded with 3 mock banks:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Chase Bank (Active)</li>
                <li>Bank of America (Active)</li>
                <li>Wells Fargo (Login Required - should be hidden)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Test Scenarios</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Select "Chase" as source</li>
                <li>Verify "Wells Fargo" is hidden</li>
                <li>Verify "Bank of America" is in destination</li>
                <li>Select "Chase" as destination (should fail/hide)</li>
                <li>Enter amount 0 (should error)</li>
                <li>Enter amount 100 (valid)</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
