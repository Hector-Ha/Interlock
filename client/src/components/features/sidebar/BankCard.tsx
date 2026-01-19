"use client";

import { cn } from "@/lib/utils";

/**
 * Credit card gradient variants matching the design mockup.
 * Each variant provides a unique gradient background.
 */
const cardVariants = {
  blue: "bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-600",
  pink: "bg-gradient-to-br from-pink-400 via-pink-300 to-rose-300",
  purple: "bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400",
  teal: "bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-400",
} as const;

type CardVariant = keyof typeof cardVariants;

export interface BankCardProps {
  bankName: string;
  cardholderName: string;
  maskedNumber: string;
  expiration: string;
  variant?: CardVariant;
  className?: string;
}

/**
 * A styled credit card component matching the dashboard design.
 * Displays bank name, cardholder info, masked card number, and expiration.
 */
export function BankCard({
  bankName,
  cardholderName,
  maskedNumber,
  expiration,
  variant = "blue",
  className,
}: BankCardProps) {
  return (
    <div
      className={cn(
        "relative w-full aspect-[1.6/1] rounded-2xl p-5 text-white shadow-xl overflow-hidden",
        cardVariants[variant],
        className,
      )}
    >
      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top row: Bank name + Contactless icon */}
        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold tracking-wide">
            {bankName}
          </span>
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
            <span className="uppercase tracking-wider">{cardholderName}</span>
            <span>{expiration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-widest">
              {maskedNumber}
            </span>
            {/* Visa-style badge */}
            <span className="text-xs font-bold italic tracking-wide opacity-90">
              VISA
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
