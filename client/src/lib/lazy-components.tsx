"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loaded components for code splitting
 * These components are loaded on-demand to reduce initial bundle size.
 */

// AddBankModal - Lazy loaded bank connection modal
export const AddBankModal = dynamic(
  () =>
    import("@/components/features/banks/AddBankModal").then(
      (mod) => mod.AddBankModal,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

// TransferDetailModal - Loaded on demand when viewing transfer details
export const TransferDetailModal = dynamic(
  () =>
    import("@/components/features/transfers/TransferDetailModal").then(
      (mod) => mod.TransferDetailModal,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

// RecipientSearch - P2P recipient search component
export const RecipientSearch = dynamic(
  () =>
    import("@/components/features/p2p/RecipientSearch").then(
      (mod) => mod.RecipientSearch,
    ),
  {
    ssr: false,
    loading: () => <div className="h-12 animate-pulse bg-gray-200 rounded" />,
  },
);

// P2PTransferForm - Full P2P transfer form
export const P2PTransferForm = dynamic(
  () =>
    import("@/components/features/transfers/P2PTransferForm").then(
      (mod) => mod.P2PTransferForm,
    ),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
  },
);
