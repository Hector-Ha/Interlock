import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

function TransferRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5 border-b border-[var(--color-gray-soft)] last:border-b-0">
      <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

function TransferFormSkeleton() {
  return (
    <Card padding="none" className="p-6 space-y-6 border-[var(--color-gray-soft)]">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="flex justify-center py-2">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </Card>
  );
}

function TransfersHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-gray-soft)] animate-pulse"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-warning-main)] rounded-full blur-[40px] opacity-10" />
          <div className="relative flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-3 w-28 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-gray-soft)] animate-pulse"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-brand-main)] rounded-full blur-[40px] opacity-10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TransferTypeCardSkeleton() {
  return <Skeleton className="h-20 rounded-xl" />;
}

function TransferHistoryCardSkeleton() {
  return (
    <Card padding="none" className="border-[var(--color-gray-soft)]">
      <div className="flex items-center justify-between p-5 border-b border-[var(--color-gray-soft)]">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <TransferRowSkeleton key={i} />
        ))}
      </div>
      <div className="p-4 border-t border-[var(--color-gray-soft)]">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

function TransfersPageSkeleton() {
  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          <TransfersHeaderSkeleton />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <TransferTypeCardSkeleton />
                <TransferTypeCardSkeleton />
              </div>
              <TransferFormSkeleton />
            </div>
            <TransferHistoryCardSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}

export {
  TransferRowSkeleton,
  TransferFormSkeleton,
  TransfersHeaderSkeleton,
  TransferTypeCardSkeleton,
  TransferHistoryCardSkeleton,
  TransfersPageSkeleton,
};
