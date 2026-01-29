"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "brand" | "success" | "warning" | "default";
}

const variantStyles = {
  brand: {
    iconBg: "bg-[var(--color-brand-surface)]",
    iconColor: "text-[var(--color-brand-main)]",
    hoverBorder: "group-hover:border-[var(--color-brand-disabled)]",
    gradientFrom: "from-[var(--color-brand-surface)]/50",
    hoverText: "group-hover:text-[var(--color-brand-main)]",
  },
  success: {
    iconBg: "bg-[var(--color-success-surface)]",
    iconColor: "text-[var(--color-success-main)]",
    hoverBorder: "group-hover:border-[var(--color-success-disabled)]",
    gradientFrom: "from-[var(--color-success-surface)]/50",
    hoverText: "group-hover:text-[var(--color-success-main)]",
  },
  warning: {
    iconBg: "bg-[var(--color-warning-surface)]",
    iconColor: "text-[var(--color-warning-main)]",
    hoverBorder: "group-hover:border-[var(--color-warning-disabled)]",
    gradientFrom: "from-[var(--color-warning-surface)]/50",
    hoverText: "group-hover:text-[var(--color-warning-main)]",
  },
  default: {
    iconBg: "bg-[var(--color-gray-surface)]",
    iconColor: "text-[var(--color-gray-main)]",
    hoverBorder: "group-hover:border-[var(--color-gray-disabled)]",
    gradientFrom: "from-[var(--color-gray-surface)]/50",
    hoverText: "group-hover:text-[var(--color-gray-hover)]",
  },
};

export function QuickActionCard({
  icon,
  label,
  description,
  href,
  onClick,
  disabled = false,
  variant = "default",
}: QuickActionCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <Card
      padding="none"
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border border-[var(--color-gray-disabled)]/50",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : [
              "cursor-pointer",
              "hover:shadow-lg hover:shadow-[var(--color-gray-main)]/5",
              "hover:-translate-y-0.5",
              styles.hoverBorder,
            ],
      )}
    >
      {/* Hover gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300",
          styles.gradientFrom,
          !disabled && "group-hover:opacity-100",
        )}
      />

      <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-3 sm:p-5">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-transform duration-300 shrink-0",
            styles.iconBg,
            !disabled && "group-hover:scale-110",
          )}
        >
          <span className={cn(styles.iconColor, "[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5")}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p
            className={cn(
              "font-semibold text-xs sm:text-base text-[var(--color-gray-text)] transition-colors",
              !disabled && styles.hoverText,
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs sm:text-sm text-[var(--color-gray-main)] truncate hidden sm:block">
              {description}
            </p>
          )}
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gray-disabled)] transition-all duration-300 shrink-0 hidden sm:block",
            !disabled && cn(styles.hoverText, "group-hover:translate-x-1"),
          )}
        />
      </div>
    </Card>
  );

  if (disabled) {
    return content;
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return <Link href={href || "#"}>{content}</Link>;
}
