import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/Card";

export function BalanceCardSkeleton() {
  return (
    <Card className="p-6 border-border/50">
      <Skeleton className="h-4 w-24 mb-2 bg-muted animate-pulse" />
      <Skeleton className="h-8 w-32 mb-4 bg-muted animate-pulse" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20 bg-muted animate-pulse" />
        <Skeleton className="h-4 w-20 bg-muted animate-pulse" />
      </div>
    </Card>
  );
}

export function BankCardSkeleton() {
  return (
    <Card className="p-4 border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="h-10 w-10 bg-muted animate-pulse" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2 bg-muted animate-pulse" />
          <Skeleton className="h-3 w-20 bg-muted animate-pulse" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 bg-muted animate-pulse" />
    </Card>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-border/50">
      <Skeleton variant="circular" className="h-10 w-10 bg-muted animate-pulse" />
      <div className="flex-1">
        <Skeleton className="h-4 w-40 mb-2 bg-muted animate-pulse" />
        <Skeleton className="h-3 w-24 bg-muted animate-pulse" />
      </div>
      <Skeleton className="h-4 w-16 bg-muted animate-pulse" />
    </div>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2 bg-muted animate-pulse" />
          <Skeleton className="h-4 w-32 bg-muted animate-pulse" />
        </div>
        <Skeleton className="h-10 w-32 bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCardSkeleton />
        <BalanceCardSkeleton />
        <BalanceCardSkeleton />
      </div>

      <div>
        <Skeleton className="h-6 w-24 mb-4 bg-muted animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BankCardSkeleton />
          <BankCardSkeleton />
        </div>
      </div>

      <Card className="border-border/50">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-6 w-40 bg-muted animate-pulse" />
        </div>
        <TransactionListSkeleton count={5} />
      </Card>
    </div>
  );
}
