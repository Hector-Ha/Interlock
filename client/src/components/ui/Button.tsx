import * as React from "react";
import {
  Button as RAButton,
  ButtonProps as RAButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-bg-brand-solid)] text-white hover:bg-[var(--color-bg-brand-solid_hover)] shadow-xs border border-[var(--color-bg-brand-solid)]",
        secondary:
          "bg-white border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary_hover)] shadow-xs",
        secondaryColor:
          "bg-white border border-[var(--color-border-brand)] text-[var(--color-text-brand-secondary)] hover:bg-[var(--color-bg-brand-primary)] shadow-xs",
        tertiary:
          "text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-secondary)]",
        tertiaryColor:
          "text-[var(--color-text-brand-secondary)] hover:bg-[var(--color-bg-brand-primary)]",
        linkColor:
          "text-[var(--color-text-brand-secondary)] hover:text-[var(--color-text-brand-secondary_hover)] underline-offset-4 hover:underline p-0 h-auto font-medium",
        linkGray:
          "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] underline-offset-4 hover:underline p-0 h-auto font-medium",
        destructive:
          "bg-[var(--color-bg-error-solid)] text-white hover:bg-[var(--color-bg-error-solid_hover)] shadow-xs border border-[var(--color-bg-error-solid)]",
        ghost:
          "hover:bg-[var(--color-bg-secondary_hover)] text-[var(--color-text-secondary)]",
      },
      size: {
        sm: "h-9 px-3 text-sm gap-2",
        md: "h-10 px-4 py-2 text-sm gap-2",
        lg: "h-11 px-5 text-base gap-2",
        xl: "h-12 px-6 text-base gap-2",
        "2xl": "h-14 px-7 text-lg gap-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends RAButtonProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <RAButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
