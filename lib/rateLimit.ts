interface RateLimitItem {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private buckets = new Map<string, RateLimitItem>();
  private maxTokens: number;
  private refillRate: number; // tokens per minute
  private refillInterval: number; // milliseconds

  constructor(maxTokens = 10, refillRate = 10) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = 60000; // 1 minute
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(identifier) || {
      tokens: this.maxTokens,
      lastRefill: now
    };

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((timePassed / this.refillInterval) * this.refillRate);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      this.buckets.set(identifier, bucket);
      return true;
    }

    this.buckets.set(identifier, bucket);
    return false;
  }

  getRemainingTokens(identifier: string): number {
    const bucket = this.buckets.get(identifier);
    if (!bucket) return this.maxTokens;
    
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((timePassed / this.refillInterval) * this.refillRate);
    
    return Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
  }

  getResetTime(identifier: string): number {
    const bucket = this.buckets.get(identifier);
    if (!bucket || bucket.tokens > 0) return 0;
    
    const tokensNeeded = 1;
    const timeToRefill = (tokensNeeded / this.refillRate) * this.refillInterval;
    return bucket.lastRefill + timeToRefill;
  }
}

export const rateLimiter = new RateLimiter();