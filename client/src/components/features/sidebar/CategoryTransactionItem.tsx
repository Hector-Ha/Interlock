"use client";

import { cn } from "@/lib/utils";

const bgStyles = [
  "bg-blue-50 text-blue-600",
  "bg-pink-50 text-pink-600",
  "bg-purple-50 text-purple-600",
  "bg-orange-50 text-orange-600",
  "bg-emerald-50 text-emerald-600",
];

export interface CategoryTransactionItemProps {
  icon: React.ReactNode;
  label: string;
  positiveAmount?: number;
  negativeAmount?: number;
  index?: number;
  className?: string;
}

export function CategoryTransactionItem({
  icon,
  label,
  positiveAmount,
  negativeAmount,
  index = 0,
  className,
}: CategoryTransactionItemProps) {
  const iconStyle = bgStyles[index % bgStyles.length];

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            iconStyle
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground truncate">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium shrink-0 ml-2">
        {positiveAmount && positiveAmount > 0 && (
          <span className="text-success-main">+${positiveAmount.toLocaleString()}</span>
        )}
        {negativeAmount && negativeAmount > 0 && (
          <span className="text-foreground">-${negativeAmount.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}
