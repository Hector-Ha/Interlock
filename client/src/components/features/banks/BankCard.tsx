"use client";

import Link from "next/link";
import { Wifi, ChevronRight } from "lucide-react";
import type { Bank } from "@/types/bank";
import { cn } from "@/lib/utils";

interface BankCardProps {
  bank: Bank;
  index?: number;
  compact?: boolean;
}

const cardVariants = [
  {
    gradient:
      "from-[var(--color-gray-text)] via-[#2d2d3a] to-[var(--color-brand-text)]",
    accent: "bg-[var(--color-brand-main)]",
  },
  {
    gradient: "from-[#1a365d] via-[#2c5282] to-[#2b6cb0]",
    accent: "bg-[var(--color-success-main)]",
  },
  {
    gradient: "from-[#322659] via-[#44337a] to-[#553c9a]",
    accent: "bg-[var(--color-brand-disabled)]",
  },
  {
    gradient: "from-[#1a4731] via-[#22543d] to-[#276749]",
    accent: "bg-[var(--color-success-main)]",
  },
  {
    gradient: "from-[#742a2a] via-[#9b2c2c] to-[#c53030]",
    accent: "bg-[var(--color-warning-main)]",
  },
] as const;

function hashBankName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function BankCard({ bank, index, compact = false }: BankCardProps) {
  const variantIndex =
    index !== undefined
      ? index % cardVariants.length
      : hashBankName(bank.institutionName) % cardVariants.length;

  const variant = cardVariants[variantIndex];
  const mask = bank.accounts?.[0]?.mask || "••••";
  const totalBalance =
    bank.accounts?.reduce((sum, acc) => sum + (acc.balance.current || 0), 0) ||
    0;

  return (
    <Link href={`/banks/${bank.id}`} className="block group">
      <div
        className={cn(
          "relative w-full rounded-2xl text-white overflow-hidden",
          compact ? "aspect-[1.7/1] p-3.5" : "aspect-[1.7/1] p-5 sm:p-6",
          "shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30",
          "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]",
          "bg-gradient-to-br",
          variant.gradient,
        )}
      >
        {/* Security Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`card-grid-${bank.id}`}
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="12" cy="12" r="1" fill="white" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#card-grid-${bank.id})`}
            />
          </svg>
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top Row */}
          <div className="flex items-start justify-between">
            <div>
              <p
                className={cn(
                  "text-white/60 uppercase tracking-wider mb-1",
                  compact ? "text-[9px]" : "text-xs",
                )}
              >
                {bank.accounts?.length || 0}{" "}
                {bank.accounts?.length === 1 ? "Account" : "Accounts"}
              </p>
              <h3
                className={cn(
                  "font-bold tracking-tight",
                  compact ? "text-sm" : "text-lg",
                )}
              >
                {bank.institutionName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider",
                  compact ? "text-[8px] px-2 py-0.5" : "text-[10px]",
                  bank.status === "ACTIVE"
                    ? "bg-[var(--color-success-main)]/20 text-[var(--color-success-soft)]"
                    : "bg-white/20 text-white/80",
                )}
              >
                {bank.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Middle - Chip & Contactless */}
          <div className={cn("flex items-center", compact ? "gap-2" : "gap-4")}>
            <div
              className={cn(
                "rounded-md",
                compact ? "w-7 h-5" : "w-10 h-7",
                variant.accent,
                "opacity-80",
              )}
            />
            <Wifi
              className={cn(
                "rotate-90 opacity-60",
                compact ? "w-4 h-4 ml-1" : "w-6 h-6",
              )}
            />
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between">
            <div>
              <p
                className={cn(
                  "text-white/50 mb-1",
                  compact ? "text-[9px]" : "text-xs",
                )}
              >
                Card Number
              </p>
              <p
                className={cn(
                  "font-mono tracking-widest",
                  compact ? "text-[10px]" : "text-sm",
                )}
              >
                •••• •••• •••• {mask}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-white/50 mb-1",
                  compact ? "text-[9px]" : "text-xs",
                )}
              >
                Balance
              </p>
              <p
                className={cn(
                  "font-bold tabular-nums",
                  compact ? "text-sm" : "text-lg",
                )}
              >
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Hover Arrow */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20",
            compact ? "right-3.5" : "right-5 sm:right-6",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />
      </div>
    </Link>
  );
}
