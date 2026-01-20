import { forwardRef, type HTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustItem {
  icon: LucideIcon;
  label: string;
}

export interface TrustIndicatorsProps extends HTMLAttributes<HTMLDivElement> {
  items: TrustItem[];
}

const TrustIndicators = forwardRef<HTMLDivElement, TrustIndicatorsProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-4 gap-y-2",
          className,
        )}
        {...props}
      >
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs text-muted-foreground group"
            >
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-success-surface">
                <Icon
                  className="h-3 w-3 text-success-main"
                  aria-hidden="true"
                />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  },
);

TrustIndicators.displayName = "TrustIndicators";

export { TrustIndicators };
