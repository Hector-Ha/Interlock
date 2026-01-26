"use client";

import { ArrowRightLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type TransferType = "internal" | "p2p";

interface TransferTypeCardProps {
  type: TransferType;
  isActive: boolean;
  onClick: () => void;
}

const typeConfig = {
  internal: {
    icon: ArrowRightLeft,
    title: "Between Accounts",
    shortTitle: "Internal",
  },
  p2p: {
    icon: Send,
    title: "Send to User",
    shortTitle: "P2P",
  },
};

export function TransferTypeCard({ type, isActive, onClick }: TransferTypeCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 flex items-center justify-center gap-2 px-4 py-4 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-main)]",
        isActive
          ? "bg-white text-[var(--color-brand-main)]"
          : "bg-[var(--color-gray-surface)] text-[var(--color-gray-main)] hover:text-[var(--color-gray-text)] hover:bg-[var(--color-gray-soft)]/50"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-main)]" />
      )}

      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[var(--color-brand-main)]" : "text-[var(--color-gray-main)]"
        )}
        aria-hidden="true"
      />

      <span className="font-medium text-sm">
        <span className="hidden sm:inline">{config.title}</span>
        <span className="sm:hidden">{config.shortTitle}</span>
      </span>
    </button>
  );
}
