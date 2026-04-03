// In-process rate limiter backed by a Map — sufficient for single-instance deployments.
// For multi-instance / serverless, replace with an external store (Redis, Upstash, etc.).

interface RateLimitEntry {
  count: number;
  resetsAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetsAt: number;
}

/**
 * Check whether a key has exceeded the allowed limit within the window.
 *
 * @param key      - Unique identifier (e.g. "magic-link:user@example.com")
 * @param limit    - Maximum number of requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Prune all expired entries to prevent unbounded Map growth
  for (const [k, v] of store) {
    if (v.resetsAt < now) store.delete(k);
  }

  const entry = store.get(key);

  if (!entry || entry.resetsAt < now) {
    // Start a fresh window
    store.set(key, { count: 1, resetsAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetsAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetsAt: entry.resetsAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetsAt: entry.resetsAt };
}
