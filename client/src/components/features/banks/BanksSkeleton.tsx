import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

function BanksHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="none" className="p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-10 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BankCardSkeleton() {
  return (
    <div className="aspect-[1.7/1] rounded-2xl bg-gradient-to-br from-[var(--color-gray-hover)] via-[#2d2d3a] to-[var(--color-gray-text)] p-5 sm:p-6 shadow-xl shadow-black/20 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="card-skeleton-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-skeleton-grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-3 w-16 mb-2 bg-white/10" />
            <Skeleton className="h-5 w-32 bg-white/10" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full bg-white/10" />
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}

function BanksSkeleton() {
  return (
    <div className="space-y-8">
      <BanksHeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <BankCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { BanksHeaderSkeleton, BankCardSkeleton, BanksSkeleton };
