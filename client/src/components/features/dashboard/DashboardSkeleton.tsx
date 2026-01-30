import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function BalanceOverviewSkeleton() {
  return (
    <Card
      padding="none"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
    >
      <div className="p-3 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-8">
          <Skeleton className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10" />
          <div>
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 mb-1.5 sm:mb-2 bg-white/10" />
            <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 bg-white/10" />
          </div>
        </div>

        {/* Balance */}
        <Skeleton className="h-8 sm:h-14 w-40 sm:w-64 mb-2 sm:mb-3 bg-white/10" />
        <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-4 sm:mb-8 bg-white/10" />

        {/* Account Bars */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-6">
          <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mb-1.5 sm:mb-2 bg-white/10" />
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5 sm:mb-1">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 bg-white/10" />
                <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-white/10" />
              </div>
              <Skeleton className="h-1 sm:h-1.5 w-full rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-2.5 sm:pt-4 border-t border-white/10">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-white/10" />
          <Skeleton className="h-6 sm:h-8 w-16 sm:w-24 bg-white/10" />
        </div>
      </div>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} padding="none" className="p-2.5 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4">
            <Skeleton className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl" />
            <div className="flex-1 w-full sm:w-auto">
              <Skeleton className="h-3 sm:h-4 w-14 sm:w-20 mx-auto sm:mx-0 mb-1 sm:mb-2" />
              <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-32 mx-auto sm:mx-0 hidden sm:block" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <Card padding="none">
      <div className="p-3 sm:p-6 border-b border-[var(--color-gray-soft)]">
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-1.5 sm:mb-2" />
        <Skeleton className="h-3 sm:h-4 w-40 sm:w-48 hidden sm:block" />
      </div>
      <div className="divide-y divide-[var(--color-gray-soft)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-4">
            <Skeleton className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-1.5 sm:mb-2" />
              <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24" />
            </div>
            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
              <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 hidden sm:block" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-3 sm:h-5 w-16 sm:w-24 mb-1.5 sm:mb-2" />
          <Skeleton className="h-5 sm:h-8 w-24 sm:w-40" />
        </div>
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
      </div>

      {/* Balance Overview */}
      <BalanceOverviewSkeleton />

      {/* Quick Actions */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-3 sm:p-6 pb-2.5 sm:pb-4 border-b border-[var(--color-gray-soft)]">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
        </div>
        <div className="p-3 sm:p-6">
          <QuickActionsSkeleton />
        </div>
      </Card>

      {/* Transactions */}
      <TransactionsSkeleton />
    </div>
  );
}
