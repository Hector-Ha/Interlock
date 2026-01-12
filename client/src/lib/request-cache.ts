// Request caching and deduplication utility.

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, PendingRequest<unknown>>();

// Default time-to-live in milliseconds (30 seconds)
const DEFAULT_TTL = 30000;

// Maximum cached entries before cleanup
const MAX_CACHE_SIZE = 100;

// Remove expired entries from the cache.
function cleanExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}

// Enforce maximum cache size by removing oldest entries.
function enforceMaxSize(): void {
  if (cache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => cache.delete(key));
  }
}

interface CachedRequestOptions {
  ttl?: number;
  force?: boolean;
}

// Execute a request with caching and deduplication.
export async function cachedRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedRequestOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, force = false } = options;
  const now = Date.now();

  // Check cache first
  if (!force) {
    const cached = cache.get(key) as CacheEntry<T> | undefined;
    if (cached && now < cached.expiresAt) {
      return cached.data;
    }
  }

  // Check for pending request (deduplication)
  const pendingRequest = pending.get(key) as PendingRequest<T> | undefined;
  if (pendingRequest) {
    return pendingRequest.promise;
  }

  // Make the request
  const promise = fetcher()
    .then((data) => {
      // Cache the result
      cache.set(key, {
        data,
        timestamp: now,
        expiresAt: now + ttl,
      });

      cleanExpiredEntries();
      enforceMaxSize();

      return data;
    })
    .finally(() => {
      pending.delete(key);
    });

  pending.set(key, { promise, timestamp: now });

  return promise;
}

// Invalidate cache entries matching a pattern.
export function invalidateCache(pattern?: string | RegExp): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (
      typeof pattern === "string" ? key.includes(pattern) : pattern.test(key)
    ) {
      cache.delete(key);
    }
  }
}

// Invalidate cache entries containing any of the specified tags.
export function invalidateCacheByTags(tags: string[]): void {
  for (const [key] of cache.entries()) {
    if (tags.some((tag) => key.includes(tag))) {
      cache.delete(key);
    }
  }
}
