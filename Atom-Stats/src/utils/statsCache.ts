interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class StatsCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxAge: number = 5 * 60 * 1000; // 5分钟默认过期时间

  set<T>(key: string, data: T, maxAge?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  setMaxAge(maxAge: number): void {
    this.maxAge = maxAge;
  }
}

export const statsCache = new StatsCache();
