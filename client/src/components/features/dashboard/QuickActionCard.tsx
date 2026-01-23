"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
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
  },
  success: {
    iconBg: "bg-[var(--color-success-surface)]",
    iconColor: "text-[var(--color-success-main)]",
    hoverBorder: "group-hover:border-[var(--color-success-disabled)]",
    gradientFrom: "from-[var(--color-success-surface)]/50",
  },
  warning: {
    iconBg: "bg-[var(--color-warning-surface)]",
    iconColor: "text-[var(--color-warning-main)]",
    hoverBorder: "group-hover:border-[var(--color-warning-disabled)]",
    gradientFrom: "from-[var(--color-warning-surface)]/50",
  },
  default: {
    iconBg: "bg-[var(--color-gray-surface)]",
    iconColor: "text-[var(--color-gray-main)]",
    hoverBorder: "group-hover:border-[var(--color-gray-disabled)]",
    gradientFrom: "from-[var(--color-gray-surface)]/50",
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
            ]
      )}
    >
      {/* Hover gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300",
          styles.gradientFrom,
          !disabled && "group-hover:opacity-100"
        )}
      />

      <div className="relative flex items-center gap-4 p-4 sm:p-5">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 shrink-0",
            styles.iconBg,
            !disabled && "group-hover:scale-110"
          )}
        >
          <span className={styles.iconColor}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-semibold text-[var(--color-gray-text)] transition-colors",
              !disabled && "group-hover:text-[var(--color-brand-main)]"
            )}
          >
            {label}
          </p>
          <p className="text-sm text-[var(--color-gray-main)] truncate">{description}</p>
        </div>
        <ChevronRight
          className={cn(
            "w-5 h-5 text-[var(--color-gray-disabled)] transition-all duration-300 shrink-0",
            !disabled && "group-hover:text-[var(--color-brand-main)] group-hover:translate-x-1"
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
