"use client";

import { useState, useCallback, useRef } from "react";

interface UseRefreshOptions {
  minDuration?: number; // Minimum time to show loading state
  debounceMs?: number; // Debounce rapid clicks
}

interface UseRefreshResult<T> {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  refresh: () => Promise<T | undefined>;
}

// Hook for handling refresh functionality with debounce and loading state.
// Provides smooth UX by preventing rapid clicks and showing minimum loading duration.
export function useRefresh<T>(
  refreshFn: () => Promise<T>,
  options: UseRefreshOptions = {}
): UseRefreshResult<T> {
  const { minDuration = 500, debounceMs = 1000 } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);

  const refresh = useCallback(async () => {
    // Debounce check
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < debounceMs) {
      return;
    }

    setIsRefreshing(true);
    const startTime = Date.now();
    lastRefreshTimeRef.current = startTime;

    try {
      const result = await refreshFn();

      // Ensure minimum loading duration for smooth UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDuration - elapsed)
        );
      }

      setLastRefresh(new Date());
      return result;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFn, minDuration, debounceMs]);

  return {
    isRefreshing,
    lastRefresh,
    refresh,
  };
}
