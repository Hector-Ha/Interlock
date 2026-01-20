import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AuthFooterLinksProps extends HTMLAttributes<HTMLDivElement> {
  mode: "sign-in" | "sign-up";
}

const AuthFooterLinks = forwardRef<HTMLDivElement, AuthFooterLinksProps>(
  ({ className, mode, ...props }, ref) => {
    const isSignIn = mode === "sign-in";

    return (
      <div
        ref={ref}
        className={cn("text-center text-sm text-muted-foreground", className)}
        {...props}
      >
        {isSignIn ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-brand-main hover:text-brand-hover transition-colors"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-brand-main hover:text-brand-hover transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    );
  }
);

AuthFooterLinks.displayName = "AuthFooterLinks";

export { AuthFooterLinks };
