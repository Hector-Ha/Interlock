import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

function HeroCardSkeleton() {
  return (
    <Card
      padding="none"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-hover)] via-[#2d2d3a] to-[var(--color-gray-text)]"
    >
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="skeleton-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skeleton-grid)" />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between mb-8">
          <Skeleton className="w-14 h-14 rounded-2xl bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg bg-white/10" />
            <Skeleton className="h-9 w-28 rounded-lg bg-white/10" />
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-48 bg-white/10" />
            <Skeleton className="w-10 h-10 rounded-lg bg-white/10" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6 border-t border-white/10">
          <div>
            <Skeleton className="h-7 w-40 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-44 bg-white/10" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-6 w-28 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
          <Skeleton className="h-3 w-28 bg-white/10" />
          <Skeleton className="h-3 w-32 bg-white/10" />
          <Skeleton className="h-3 w-36 bg-white/10" />
        </div>
      </div>
    </Card>
  );
}

function AccountCardSkeleton() {
  return (
    <Card padding="none" className="animate-pulse">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="text-right shrink-0">
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 sm:px-6 py-4">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-36 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}

function TransactionsSectionSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 border-b border-[var(--color-gray-soft)]">
        <Skeleton className="h-6 w-28" />
        <div className="flex items-center gap-3 flex-1 sm:justify-end">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      <div className="divide-y divide-[var(--color-gray-soft)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    </Card>
  );
}

export function BankDetailSkeleton() {
  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-[var(--color-gray-main)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Banks
          </Button>

          <HeroCardSkeleton />

          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
              ))}
            </div>
          </div>

          <TransactionsSectionSkeleton />
        </div>
      </div>
    </section>
  );
}

export {
  HeroCardSkeleton,
  AccountCardSkeleton,
  TransactionRowSkeleton,
  TransactionsSectionSkeleton,
};
