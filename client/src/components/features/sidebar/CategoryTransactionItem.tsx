"use client";

import { cn } from "@/lib/utils";

const bgStyles = [
  "bg-blue-100 text-blue-600",
  "bg-pink-100 text-pink-600",
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-emerald-100 text-emerald-600",
];

export interface CategoryTransactionItemProps {
  icon: React.ReactNode;
  label: string;
  positiveAmount?: number;
  negativeAmount?: number;
  index?: number;
  className?: string;
}

/**
 * Display category summarized transactions (income/expense)
 * Visual: Icon | Label | +$Income -$Expense
 */
export function CategoryTransactionItem({
  icon,
  label,
  positiveAmount,
  negativeAmount,
  index = 0,
  className,
}: CategoryTransactionItemProps) {
  // Cycle background colors for icons based on index
  const iconStyle = bgStyles[index % bgStyles.length];

  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      {/* Icon + Label */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconStyle,
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>

      {/* Amounts */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        {positiveAmount && positiveAmount > 0 && (
          <span className="text-emerald-600">+${positiveAmount}</span>
        )}
        {negativeAmount && negativeAmount > 0 && (
          <span className="text-red-500">-${negativeAmount}</span>
        )}
      </div>
    </div>
  );
}
