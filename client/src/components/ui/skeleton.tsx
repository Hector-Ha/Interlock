import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "none";
}

// Skeleton loading component with variant support.
function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200",
        animation === "pulse" && "animate-pulse",
        variant === "text" && "rounded h-4",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  );
}

// Convenience components for common patterns
function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
}

function AvatarSkeleton({
  size = "md",
  ...props
}: { size?: "sm" | "md" | "lg" } & React.HTMLAttributes<HTMLDivElement>) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Skeleton variant="circular" className={sizeClasses[size]} {...props} />
  );
}

export { Skeleton, TextSkeleton, AvatarSkeleton };
