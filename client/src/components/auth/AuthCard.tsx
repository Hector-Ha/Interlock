import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md bg-card border border-border/60 shadow-lg rounded-2xl p-6 sm:p-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AuthCard.displayName = "AuthCard";

export { AuthCard };
