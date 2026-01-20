import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { TrustIndicators, type TrustItem } from "./TrustIndicators";

export interface AuthHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  trustItems?: TrustItem[];
}

const AuthHeader = forwardRef<HTMLDivElement, AuthHeaderProps>(
  ({ className, title, subtitle, trustItems, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 text-center", className)}
        {...props}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
        {trustItems && trustItems.length > 0 && (
          <TrustIndicators items={trustItems} className="mt-1" />
        )}
      </div>
    );
  },
);

AuthHeader.displayName = "AuthHeader";

export { AuthHeader };
