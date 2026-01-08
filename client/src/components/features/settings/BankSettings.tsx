"use client";

import Link from "next/link";
import { Building2, ExternalLink, RefreshCw } from "lucide-react";
import { useBankStore } from "@/stores/bank.store";
import { Card, Button, Badge } from "@/components/ui";

export function BankSettings() {
  const { banks, isLoading } = useBankStore();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success-surface">
            <Building2 className="h-5 w-5 text-success-text" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Connected Banks
            </h2>
            <p className="text-sm text-content-secondary">
              Manage your linked bank accounts
            </p>
          </div>
        </div>
        <Link href="/banks">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-content-tertiary" />
        </div>
      ) : banks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-content-secondary mb-4">No banks connected yet</p>
          <Link href="/banks">
            <Button>Connect a Bank</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {banks.slice(0, 3).map((bank) => (
            <div
              key={bank.id}
              className="flex items-center justify-between p-4 rounded-xl bg-background-secondary"
            >
              <div>
                <p className="font-medium text-content-primary">
                  {bank.institutionName}
                </p>
                <p className="text-sm text-content-tertiary">
                  {bank.status === "ACTIVE"
                    ? "Connected"
                    : "Requires attention"}
                </p>
              </div>
              <Badge variant={bank.status === "ACTIVE" ? "success" : "warning"}>
                {bank.status}
              </Badge>
            </div>
          ))}
          {banks.length > 3 && (
            <p className="text-sm text-content-secondary text-center pt-2">
              +{banks.length - 3} more banks
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
