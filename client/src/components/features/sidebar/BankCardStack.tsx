"use client";

import { cn } from "@/lib/utils";
import { BankCard } from "./BankCard";
import type { Bank } from "@/types/bank";

export interface BankCardStackProps {
  banks: Bank[];
  className?: string;
}

/**
 * Stacked bank cards visualization.
 * Shows up to 2 cards with the second card offset behind the first.
 */
export function BankCardStack({ banks, className }: BankCardStackProps) {
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

  const primaryBank = banks[0];
  const secondaryBank = banks[1];

  // Get cardholder name from bank data or fallback
  const getCardholderName = (bank: Bank) => {
    // Use institution name as a display name fallback
    return bank.institutionName.toUpperCase();
  };

  // Generate masked card number from account mask or default
  const getMaskedNumber = (bank: Bank) => {
    const mask = bank.accounts?.[0]?.mask || "****";
    return `•••• •••• •••• ${mask}`;
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Primary card (front) */}
      <div className="relative z-10">
        <BankCard
          bankName={primaryBank.institutionName}
          cardholderName={getCardholderName(primaryBank)}
          maskedNumber={getMaskedNumber(primaryBank)}
          expiration="06/24"
          variant="blue"
        />
      </div>

      {/* Secondary card (behind, offset) */}
      {secondaryBank && (
        <div className="absolute right-0 top-4 w-[90%] z-0 opacity-90">
          <BankCard
            bankName={secondaryBank.institutionName}
            cardholderName={getCardholderName(secondaryBank)}
            maskedNumber={getMaskedNumber(secondaryBank)}
            expiration="12/25"
            variant="pink"
          />
        </div>
      )}
    </div>
  );
}
