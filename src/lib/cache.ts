/**
 * In-Memory TTL Cache for GitBoy
 * 
 * Production note:
 * To scale horizontally or survive server restarts, this Map can be replaced
 * by a Redis instance (e.g. `@upstash/redis` or `ioredis`).
 * Example Redis implementation:
 *   await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
 *   const cached = await redis.get(key);
 */

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /**
   * Set a key with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    const now = Date.now();
    this.store.set(key, {
      data,
      cachedAt: now,
      expiresAt: now + ttlSeconds * 1000,
    });
  }

  /**
   * Get non-expired cached item
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      // Data expired
      return null;
    }

    return entry.data;
  }

  /**
   * Get item even if expired (stale-while-revalidate on rate-limit)
   */
  getStale<T>(key: string): { data: T; cachedAt: number; isStale: boolean } | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    return {
      data: entry.data,
      cachedAt: entry.cachedAt,
      isStale: Date.now() > entry.expiresAt,
    };
  }

  /**
   * Delete entry
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }
}

// Global singleton for Next.js dev server hot-reloading preservation
const globalForCache = globalThis as unknown as {
  gitboyCache: MemoryCache | undefined;
};

export const cache = globalForCache.gitboyCache ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.gitboyCache = cache;
}
