"use client";

import Link from "next/link";
import type { Bank } from "@/types/bank";
import { cn } from "@/lib/utils";

interface BankCardProps {
  bank: Bank;
  /** Index used to assign distinct gradient variants */
  index?: number;
}

/**
 * Credit card gradient variants for visual distinction.
 * Cycles through variants based on bank index.
 */
const cardVariants = [
  "bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-600", // Dark blue → cyan
  "bg-gradient-to-br from-pink-400 via-pink-300 to-rose-300", // Pink
  "bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400", // Purple
  "bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-400", // Teal/Green
  "bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300", // Orange/Gold
  "bg-gradient-to-br from-indigo-600 via-blue-500 to-sky-400", // Blue
] as const;

/**
 * Generate a consistent variant index based on bank name for color consistency.
 */
function hashBankName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function BankCard({ bank, index }: BankCardProps) {
  // Use index if provided, otherwise hash the bank name for consistent color
  const variantIndex =
    index !== undefined
      ? index % cardVariants.length
      : hashBankName(bank.institutionName) % cardVariants.length;

  const gradientClass = cardVariants[variantIndex];

  // Get masked account number from first account or fallback
  const mask = bank.accounts?.[0]?.mask || "****";
  const maskedNumber = `•••• •••• •••• ${mask}`;

  return (
    <Link href={`/banks/${bank.id}`} className="block">
      <div
        className={cn(
          "group relative w-full aspect-[1.6/1] rounded-2xl p-5 text-white shadow-xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer",
          gradientClass,
        )}
      >
        {/* Card content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top row: Bank name + Contactless icon */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide">
                {bank.institutionName}
              </span>
              <span
                className={cn(
                  "text-xs font-medium mt-1 px-2 py-0.5 rounded-full w-fit",
                  bank.status === "ACTIVE"
                    ? "bg-white/20 text-white"
                    : "bg-white/30 text-white/90",
                )}
              >
                {bank.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
            {/* Contactless payment icon */}
            <svg
              className="w-8 h-8 opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6" />
              <path d="M11.5 16.5A3.5 3.5 0 0 0 15 13c0-2-.5-3-1-4.5C12.654 5.775 13.417 3.25 16 1" />
              <path d="M14.5 18.5A4.5 4.5 0 0 0 19 14c0-2.5-.5-4-1-6-.8-3.2.2-6.36 3-9" />
            </svg>
          </div>

          {/* Bottom section: Card details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs opacity-80">
              <span className="uppercase tracking-wider">ACCOUNT</span>
              <span>{bank.accounts?.length || 0} linked</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm tracking-widest">
                {maskedNumber}
              </span>
              {/* Card network badge */}
              <span className="text-xs font-bold italic tracking-wide opacity-90">
                BANK
              </span>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
      </div>
    </Link>
  );
}
