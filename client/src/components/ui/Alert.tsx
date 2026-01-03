"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full overflow-hidden rounded-xl shadow-sm flex items-stretch ring-1 ring-border/50",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground",
        destructive: "bg-error-surface text-destructive",
        info: "bg-brand-surface text-brand-text",
        success: "bg-success-surface text-success-text",
        warning: "bg-warning-surface text-warning-text",
        error: "bg-error-surface text-error-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertIconStyles = {
  default: "bg-muted text-muted-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  info: "bg-brand-main text-brand-surface",
  success: "bg-success-main text-success-surface",
  warning: "bg-warning-main text-warning-surface",
  error: "bg-error-main text-error-surface",
};

const alertIcons = {
  default: Info,
  destructive: XCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void;
  showIcon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = "default", children, onDismiss, showIcon, ...props },
    ref
  ) => {
    const Icon = alertIcons[variant || "default"];
    const iconClass = alertIconStyles[variant || "default"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {/* Left colored strip with Icon */}
        <div
          className={cn(
            "flex w-12 items-center justify-center shrink-0",
            iconClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 pl-4">{children}</div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-3 top-3 rounded-lg p-1 opacity-70 hover:opacity-100 transition-opacity hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
