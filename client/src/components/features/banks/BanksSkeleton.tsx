import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function BanksHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} padding="none" className="p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-8 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BankCardSkeleton() {
  return (
    <div className="aspect-[1.7/1] rounded-2xl bg-gradient-to-br from-[var(--color-gray-hover)] to-[var(--color-gray-text)] p-5 sm:p-6">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-3 w-16 mb-2 bg-white/10" />
            <Skeleton className="h-5 w-32 bg-white/10" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-7 rounded-md bg-white/10" />
          <Skeleton className="w-6 h-6 bg-white/10" />
        </div>
        <div className="flex justify-between items-end">
          <div>
            <Skeleton className="h-3 w-20 mb-1 bg-white/10" />
            <Skeleton className="h-4 w-36 bg-white/10" />
          </div>
          <div className="text-right">
            <Skeleton className="h-3 w-12 mb-1 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BanksSkeleton() {
  return (
    <div className="space-y-8">
      <BanksHeaderSkeleton />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <BankCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
