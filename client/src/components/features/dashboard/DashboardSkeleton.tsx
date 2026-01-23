import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function BalanceOverviewSkeleton() {
  return (
    <Card
      padding="none"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]"
    >
      <div className="p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
          <div>
            <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/10" />
          </div>
        </div>

        {/* Balance */}
        <Skeleton className="h-14 w-64 mb-3 bg-white/10" />
        <Skeleton className="h-4 w-32 mb-8 bg-white/10" />

        {/* Account Bars */}
        <div className="space-y-3 mb-6">
          <Skeleton className="h-3 w-32 mb-2 bg-white/10" />
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-4 w-16 bg-white/10" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-8 w-24 bg-white/10" />
        </div>
      </div>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} padding="none" className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
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
      <div className="p-5 sm:p-6 border-b border-[var(--color-gray-soft)]">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="divide-y divide-[var(--color-gray-soft)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 sm:px-6 py-4">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Balance Overview */}
      <BalanceOverviewSkeleton />

      {/* Quick Actions */}
      <div>
        <Skeleton className="h-5 w-28 mb-4" />
        <QuickActionsSkeleton />
      </div>

      {/* Transactions */}
      <TransactionsSkeleton />
    </div>
  );
}
