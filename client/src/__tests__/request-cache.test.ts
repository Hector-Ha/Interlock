import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cachedRequest,
  invalidateCache,
  invalidateCacheByTags,
} from "../lib/request-cache";

describe("Request Cache Utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear cache before each test
    invalidateCache();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("cachedRequest", () => {
    it("should call fetcher on first request (cache miss)", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      const result = await cachedRequest("test-key", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: "test" });
    });

    it("should return cached data on subsequent requests (cache hit)", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "cached" });

      // First request, cache miss
      await cachedRequest("cache-hit-key", fetcher);

      // Second request, should be cache hit
      const result = await cachedRequest("cache-hit-key", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1); // Only called once
      expect(result).toEqual({ data: "cached" });
    });

    it("should make new request after TTL expires", async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce({ data: "first" })
        .mockResolvedValueOnce({ data: "second" });

      const shortTtl = 1000; // 1 second

      // First request
      await cachedRequest("ttl-key", fetcher, { ttl: shortTtl });
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Fast-forward time and flush all pending timers
      // The original code already used `vi.advanceTimersByTimeAsync`.
      // The `act` wrapper is typically for React component testing and is not needed here.
      // We'll adjust the time to 1100ms as per the instruction's example.
      await vi.advanceTimersByTimeAsync(1100);

      // Second request, cache should be expired
      const result = await cachedRequest("ttl-key", fetcher, { ttl: shortTtl });

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: "second" });
    });

    it("should use default TTL of 30 seconds", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // First request
      await cachedRequest("default-ttl-key", fetcher);

      // Advance 25 seconds
      await vi.advanceTimersByTimeAsync(25000);

      // Should still be cached
      await cachedRequest("default-ttl-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Advance another 10 seconds
      await vi.advanceTimersByTimeAsync(10000);

      // Should make new request
      await cachedRequest("default-ttl-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("should deduplicate concurrent requests", async () => {
      let resolvePromise: (value: { data: string }) => void;
      const fetcher = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      // Make concurrent requests
      const promise1 = cachedRequest("dedup-key", fetcher);
      const promise2 = cachedRequest("dedup-key", fetcher);
      const promise3 = cachedRequest("dedup-key", fetcher);

      // Fetcher should only be called once
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Resolve the pending request
      resolvePromise!({ data: "deduplicated" });

      // All promises should resolve to same value
      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      expect(result1).toEqual({ data: "deduplicated" });
      expect(result2).toEqual({ data: "deduplicated" });
      expect(result3).toEqual({ data: "deduplicated" });
    });

    it("should bypass cache when force is true", async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce({ data: "first" })
        .mockResolvedValueOnce({ data: "forced" });

      // First request, cache miss
      await cachedRequest("force-key", fetcher);

      // Force bypass cache
      const result = await cachedRequest("force-key", fetcher, { force: true });

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: "forced" });
    });

    it("should handle unique keys separately", async () => {
      const fetcher1 = vi.fn().mockResolvedValue({ data: "key1" });
      const fetcher2 = vi.fn().mockResolvedValue({ data: "key2" });

      await cachedRequest("unique-key-1", fetcher1);
      await cachedRequest("unique-key-2", fetcher2);

      expect(fetcher1).toHaveBeenCalledTimes(1);
      expect(fetcher2).toHaveBeenCalledTimes(1);
    });

    it("should handle fetcher errors", async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error("Fetch failed"));

      await expect(cachedRequest("error-key", fetcher)).rejects.toThrow(
        "Fetch failed",
      );
    });
  });

  describe("invalidateCache", () => {
    it("should clear all cache entries when called without pattern", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // Populate cache
      await cachedRequest("key-1", fetcher);
      await cachedRequest("key-2", fetcher);

      // Clear all cache
      invalidateCache();

      // Should make new requests
      await cachedRequest("key-1", fetcher);
      await cachedRequest("key-2", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(4);
    });

    it("should clear matching entries when pattern is a string", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // Populate cache
      await cachedRequest("user-123", fetcher);
      await cachedRequest("user-456", fetcher);
      await cachedRequest("posts-789", fetcher);

      // Clear only user-related entries
      invalidateCache("user");

      // user keys should make new requests
      await cachedRequest("user-123", fetcher);
      await cachedRequest("user-456", fetcher);

      // posts key should still be cached
      await cachedRequest("posts-789", fetcher);

      // 3 initial + 2 new user requests = 5
      expect(fetcher).toHaveBeenCalledTimes(5);
    });

    it("should clear matching entries when pattern is a regex", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // Populate cache
      await cachedRequest("api/users/1", fetcher);
      await cachedRequest("api/users/2", fetcher);
      await cachedRequest("api/posts/1", fetcher);

      // Clear entries matching regex
      invalidateCache(/api\/users/);

      // user keys should make new requests
      await cachedRequest("api/users/1", fetcher);
      await cachedRequest("api/users/2", fetcher);

      // posts key should still be cached
      await cachedRequest("api/posts/1", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(5);
    });
  });

  describe("invalidateCacheByTags", () => {
    it("should clear entries containing any of the specified tags", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // Populate cache with tag-like keys
      await cachedRequest("user:profile:123", fetcher);
      await cachedRequest("user:settings:123", fetcher);
      await cachedRequest("bank:accounts:456", fetcher);

      // Invalidate all user-related entries
      invalidateCacheByTags(["user"]);

      // User entries should make new requests
      await cachedRequest("user:profile:123", fetcher);
      await cachedRequest("user:settings:123", fetcher);

      // Bank entry should still be cached
      await cachedRequest("bank:accounts:456", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(5);
    });

    it("should handle multiple tags", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      // Populate cache
      await cachedRequest("user:1", fetcher);
      await cachedRequest("bank:2", fetcher);
      await cachedRequest("transfer:3", fetcher);

      // Invalidate user and bank entries
      invalidateCacheByTags(["user", "bank"]);

      // Should make new requests for user and bank
      await cachedRequest("user:1", fetcher);
      await cachedRequest("bank:2", fetcher);

      // Transfer should still be cached
      await cachedRequest("transfer:3", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(5);
    });

    it("should handle empty tags array", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: "test" });

      await cachedRequest("some-key", fetcher);

      // Empty tags should not invalidate anything
      invalidateCacheByTags([]);

      await cachedRequest("some-key", fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });
});
