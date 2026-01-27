"use client";

import { useState } from "react";
import Link from "next/link";
import { Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { Bank } from "@/types/bank";

export interface BankCardStackProps {
  banks: Bank[];
  className?: string;
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

export function BankCardStack({ banks, className }: BankCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (banks.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-muted-foreground text-sm",
          className,
        )}
      >
        No banks linked yet
      </div>
    );
  }

  const goTo = (index: number) => {
    let newIndex = index;
    if (index < 0) newIndex = banks.length - 1;
    if (index >= banks.length) newIndex = 0;

    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const bank = banks[currentIndex];
  const variant = cardVariants[currentIndex % cardVariants.length];
  const mask = bank.accounts?.[0]?.mask || "••••";
  const totalBalance =
    bank.accounts?.reduce((sum, acc) => sum + (acc.balance.current || 0), 0) ||
    0;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Card Container with fixed height to prevent layout shift */}
      <div className="relative aspect-[1.7/1] w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={bank.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Link href={`/banks/${bank.id}`} className="block group h-full">
              <div
                className={cn(
                  "relative w-full h-full rounded-2xl text-white overflow-hidden p-3.5",
                  "shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30",
                  "transition-shadow duration-300",
                  "bg-gradient-to-br",
                  variant.gradient,
                )}
              >
                {/* Security Pattern */}
                <div className="absolute inset-0 opacity-[0.04]">
                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id={`card-grid-stack-${bank.id}`}
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
                      fill={`url(#card-grid-stack-${bank.id})`}
                    />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-[9px] text-white/60 uppercase tracking-wider mb-1">
                        {bank.accounts?.length || 0}{" "}
                        {bank.accounts?.length === 1 ? "Account" : "Accounts"}
                      </p>
                      <h3 className="text-sm font-bold tracking-tight truncate">
                        {bank.institutionName}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                        bank.status === "ACTIVE"
                          ? "bg-[var(--color-success-main)]/20 text-[var(--color-success-soft)]"
                          : "bg-white/20 text-white/80",
                      )}
                    >
                      {bank.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Chip & Contactless */}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 h-5 rounded-md opacity-80",
                        variant.accent,
                      )}
                    />
                    <Wifi className="w-4 h-4 rotate-90 opacity-60 ml-1" />
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] text-white/50 mb-1">
                        Card Number
                      </p>
                      <p className="text-[10px] font-mono tracking-widest">
                        •••• •••• •••• {mask}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-white/50 mb-1">Balance</p>
                      <p className="text-sm font-bold tabular-nums">
                        $
                        {totalBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-1/2 right-3.5 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - only show if multiple banks */}
      {banks.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            className="w-6 h-6 rounded-full bg-[var(--color-gray-soft)] hover:bg-[var(--color-gray-disabled)] flex items-center justify-center transition-colors"
            aria-label="Previous bank"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[var(--color-gray-main)]" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {banks.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  index === currentIndex
                    ? "w-4 bg-[var(--color-brand-main)]"
                    : "w-1.5 bg-[var(--color-gray-disabled)] hover:bg-[var(--color-gray-main)]",
                )}
                aria-label={`Go to bank ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="w-6 h-6 rounded-full bg-[var(--color-gray-soft)] hover:bg-[var(--color-gray-disabled)] flex items-center justify-center transition-colors"
            aria-label="Next bank"
          >
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-gray-main)]" />
          </button>
        </div>
      )}
    </div>
  );
}
