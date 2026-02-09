"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  fallback?: string;
  showSkeleton?: boolean;
}

// OptimizedImage component wrapping Next.js Image
export function OptimizedImage({
  src,
  alt,
  fallback = "/images/placeholder.png",
  showSkeleton = true,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showSkeleton && isLoading && (
        <Skeleton className="absolute inset-0" variant="rectangular" />
      )}
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
