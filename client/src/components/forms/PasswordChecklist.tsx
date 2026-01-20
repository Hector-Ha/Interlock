"use client";

import { Check, X, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface PasswordChecklistProps {
  password?: string;
}

export function PasswordChecklist({ password = "" }: PasswordChecklistProps) {
  const criteria = useMemo(() => {
    return [
      {
        label: "At least 8 characters",
        isValid: password.length >= 8,
      },
      {
        label: "At least one uppercase letter",
        isValid: /[A-Z]/.test(password),
      },
      {
        label: "At least one lowercase letter",
        isValid: /[a-z]/.test(password),
      },
      {
        label: "At least one number",
        isValid: /[0-9]/.test(password),
      },
      {
        label: "At least one special character",
        isValid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 rounded-lg border border-border/50 bg-muted/40 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <p className="text-xs font-medium text-muted-foreground mb-3">
        Password requirements:
      </p>
      <div className="space-y-2">
        {criteria.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                item.isValid
                  ? "border-success-main bg-success-main text-white"
                  : "border-muted-foreground/30 text-transparent",
              )}
            >
              <Check className="h-2.5 w-2.5" />
            </div>
            <span
              className={cn(
                "transition-colors duration-300",
                item.isValid
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
