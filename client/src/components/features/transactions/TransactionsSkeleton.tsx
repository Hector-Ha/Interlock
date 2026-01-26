import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

function TransactionRowSkeleton() {
  return (
    <tr className="border-b border-[var(--color-gray-soft)] last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-32 mb-1.5" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-5 py-4 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </td>
    </tr>
  );
}

function TransactionsHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-gray-soft)] animate-pulse"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-success-main)] rounded-full blur-[40px] opacity-5" />
          <div className="relative flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl bg-[var(--color-success-surface)]" />
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </Card>

        <Card
          padding="none"
          className="relative overflow-hidden p-5 border-[var(--color-gray-soft)] animate-pulse"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-error-main)] rounded-full blur-[40px] opacity-5" />
          <div className="relative flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl bg-[var(--color-error-surface)]" />
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CategoryItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}

function CategorySummarySkeleton() {
  return (
    <Card padding="none" className="overflow-hidden border-[var(--color-gray-soft)] h-fit">
      <CardHeader className="flex-row items-center justify-between p-5 lg:p-6 border-b border-[var(--color-gray-soft)]">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </CardHeader>

      <CardContent className="p-5 lg:p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <CategoryItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionFiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Skeleton className="h-9 flex-1 sm:max-w-xs rounded-lg" />
        <Skeleton className="h-9 w-full sm:w-32 rounded-lg" />
        <Skeleton className="h-9 w-full sm:w-40 rounded-lg" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-9 rounded-lg shrink-0 ${i === 0 ? "w-24" : "w-28"}`}
          />
        ))}
      </div>
    </div>
  );
}

function TransactionTableSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden border-[var(--color-gray-soft)]">
      <div className="p-5 lg:p-6 border-b border-[var(--color-gray-soft)]">
        <TransactionFiltersSkeleton />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[var(--color-gray-soft)] bg-[var(--color-gray-surface)]/50">
            <tr>
              <th className="px-5 py-3 text-left">
                <Skeleton className="h-3 w-20" />
              </th>
              <th className="px-5 py-3 text-left hidden sm:table-cell">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="px-5 py-3 text-left hidden md:table-cell">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">
                <Skeleton className="h-3 w-12" />
              </th>
              <th className="px-5 py-3 text-right">
                <Skeleton className="h-3 w-16 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TransactionsPageSkeleton() {
  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          <TransactionsHeaderSkeleton />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            <div className="xl:col-span-4">
              <CategorySummarySkeleton />
            </div>

            <div className="xl:col-span-8">
              <TransactionTableSkeleton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export {
  TransactionRowSkeleton,
  TransactionsHeaderSkeleton,
  CategoryItemSkeleton,
  CategorySummarySkeleton,
  TransactionFiltersSkeleton,
  TransactionTableSkeleton,
  TransactionsPageSkeleton,
};
