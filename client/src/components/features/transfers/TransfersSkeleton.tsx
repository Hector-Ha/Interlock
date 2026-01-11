import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/Card";

// Skeleton for a single transfer row item
export function TransferRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-4 border-b border-gray-100">
      <div className="flex-1">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

// Skeleton for the entire transfers page
export function TransfersPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Transfer List */}
      <Card>
        {Array.from({ length: 5 }).map((_, i) => (
          <TransferRowSkeleton key={i} />
        ))}
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}
