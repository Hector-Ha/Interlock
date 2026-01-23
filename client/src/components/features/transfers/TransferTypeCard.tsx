"use client";

import { ArrowRightLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
    description: "Transfer funds between your linked banks",
    gradient: "from-[var(--color-brand-main)] to-[var(--color-brand-hover)]",
    activeBg: "bg-[var(--color-brand-surface)]",
    activeText: "text-[var(--color-brand-main)]",
  },
  p2p: {
    icon: Send,
    title: "Send to User",
    description: "Send money to another Interlock user",
    gradient: "from-[var(--color-success-main)] to-[var(--color-success-hover)]",
    activeBg: "bg-[var(--color-success-surface)]",
    activeText: "text-[var(--color-success-main)]",
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
        "relative w-full text-left rounded-xl p-4 transition-all duration-300",
        "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-main)] focus-visible:ring-offset-2",
        isActive
          ? [
              "border-transparent shadow-lg",
              config.activeBg,
            ]
          : [
              "border-[var(--color-gray-soft)] bg-white",
              "hover:border-[var(--color-gray-disabled)] hover:shadow-md",
            ]
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b",
            config.gradient
          )}
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
            isActive ? config.activeBg : "bg-[var(--color-gray-surface)]"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5 transition-colors",
              isActive ? config.activeText : "text-[var(--color-gray-main)]"
            )}
          />
        </div>
        <div>
          <p
            className={cn(
              "font-semibold transition-colors",
              isActive ? config.activeText : "text-[var(--color-gray-text)]"
            )}
          >
            {config.title}
          </p>
          <p className="text-xs text-[var(--color-gray-main)]">{config.description}</p>
        </div>
      </div>
    </button>
  );
}
