"use client";

import { cn } from "@/lib/utils";

const cardVariants = {
  brand: "bg-gradient-to-br from-brand-main via-brand-hover to-brand-active",
  blue: "bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-600",
  pink: "bg-gradient-to-br from-pink-500 via-pink-400 to-rose-400",
  purple: "bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400",
  teal: "bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-400",
} as const;

type CardVariant = keyof typeof cardVariants;

export interface BankCardProps {
  bankName: string;
  cardholderName: string;
  maskedNumber: string;
  expiration: string;
  balance?: number;
  variant?: CardVariant;
  className?: string;
}

export function BankCard({
  bankName,
  cardholderName,
  maskedNumber,
  expiration,
  balance,
  variant = "brand",
  className,
}: BankCardProps) {
  return (
    <div
      className={cn(
        "relative w-full aspect-[1.6/1] rounded-2xl p-5 text-white shadow-xl overflow-hidden",
        "ring-1 ring-white/10",
        cardVariants[variant],
        className,
      )}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm font-semibold tracking-wide drop-shadow-sm">
              {bankName}
            </span>
            {balance !== undefined && (
              <p className="text-xl font-bold mt-1 drop-shadow-sm">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs opacity-90">
            <span className="uppercase tracking-wider font-medium">{cardholderName}</span>
            <span className="font-medium">{expiration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-widest drop-shadow-sm">
              {maskedNumber}
            </span>
            <span className="text-xs font-bold italic tracking-wide opacity-90">
              VISA
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}

export default BankCard;
