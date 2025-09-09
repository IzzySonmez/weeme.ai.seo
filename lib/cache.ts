interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class LRUCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTL = 15 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);
    
    return item.data;
  }

  set(key: string, data: T, ttl?: number): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const reportCache = new LRUCache<any>(50);