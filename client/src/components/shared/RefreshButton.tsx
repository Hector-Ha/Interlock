"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  className?: string;
  label?: string;
}

export function RefreshButton({
  onClick,
  isRefreshing,
  className,
  label = "Refresh",
}: RefreshButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isRefreshing}
      className={clsx("gap-2", className)}
      aria-label={isRefreshing ? "Refreshing..." : label}
    >
      <RefreshCw className={clsx("h-4 w-4", isRefreshing && "animate-spin")} />
      {isRefreshing ? "Refreshing..." : label}
    </Button>
  );
}
