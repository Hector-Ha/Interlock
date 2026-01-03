import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-main text-white hover:bg-brand-hover",
        secondary:
          "border-transparent bg-gray-main text-white hover:bg-gray-hover",
        destructive:
          "border-transparent bg-error-main text-white hover:bg-error-hover",
        outline: "text-foreground",
        // Solid Statuses
        success:
          "border-transparent bg-success-main text-white hover:bg-success-hover",
        warning:
          "border-transparent bg-warning-main text-white hover:bg-warning-hover",
        error:
          "border-transparent bg-error-main text-white hover:bg-error-hover",
        info: "border-transparent bg-brand-main text-white hover:bg-brand-hover",
        // Soft Statuses (Tinted)
        "success-soft":
          "border-transparent bg-success-soft text-success-text hover:bg-success-soft/80",
        "warning-soft":
          "border-transparent bg-warning-soft text-warning-text hover:bg-warning-soft/80",
        "error-soft":
          "border-transparent bg-error-soft text-error-text hover:bg-error-soft/80",
        "info-soft":
          "border-transparent bg-brand-soft text-brand-text hover:bg-brand-soft/80",
        "gray-soft":
          "border-transparent bg-gray-soft text-gray-text hover:bg-gray-soft/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
