import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function TransactionRowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
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

export function TransactionsPageSkeleton() {
  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} padding="none" className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Summary */}
            <Card padding="none" className="lg:col-span-1">
              <div className="p-5 border-b border-[var(--color-gray-soft)]">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Transactions Table */}
            <Card padding="none" className="lg:col-span-2">
              <div className="p-5 border-b border-[var(--color-gray-soft)]">
                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
              <table className="w-full">
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <TransactionRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
