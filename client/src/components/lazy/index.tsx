"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

// Loading component for lazy-loaded pages.
// Displays a skeleton UI while the actual component is being loaded.
function PageLoader() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

// Lazy-loaded TransferDetailModal component.
// Reduces initial bundle size by loading the modal only when needed.
export const LazyTransferDetailModal = dynamic(
  () =>
    import("@/components/features/transfers/TransferDetailModal").then(
      (mod) => mod.TransferDetailModal,
    ),
  {
    loading: () => <PageLoader />,
    ssr: false,
  },
);

// Lazy-loaded RecipientSearch component for P2P transfers.
// Loads on demand to reduce initial bundle size.
export const LazyRecipientSearch = dynamic(
  () =>
    import("@/components/features/p2p/RecipientSearch").then(
      (mod) => mod.RecipientSearch,
    ),
  {
    loading: () => <Skeleton className="h-10 w-full" />,
    ssr: false,
  },
);

export { PageLoader };
