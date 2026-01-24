"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { BankCard } from "./BankCard";
import type { Bank } from "@/types/bank";

export interface BankCardStackProps {
  banks: Bank[];
  className?: string;
}

/**
 * Carousel visualization for bank cards.
 * Shows all cards, one at a time, with swipe support and dot indicators.
 */
export function BankCardStack({ banks, className }: BankCardStackProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

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

  // Get cardholder name from bank data or fallback
  const getCardholderName = (bank: Bank) => {
    // Use institution name as a display name fallback
    return bank.institutionName.toUpperCase();
  };

  // Generate masked card number from account mask or default
  const getMaskedNumber = (bank: Bank) => {
    const mask = bank.accounts?.[0]?.mask || "••••";
    return `•••• •••• •••• ${mask}`;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom -ml-4">
          {banks.map((bank, index) => (
            <div
              key={bank.id}
              className="flex-[0_0_100%] min-w-0 pl-4 relative"
            >
              <BankCard
                bankName={bank.institutionName}
                cardholderName={getCardholderName(bank)}
                maskedNumber={getMaskedNumber(bank)}
                expiration="12/26"
                variant={index % 2 === 0 ? "blue" : "pink"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {banks.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "bg-[var(--color-brand-main)] w-4"
                  : "bg-[var(--color-gray-disabled)] hover:bg-[var(--color-gray-main)]",
              )}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
