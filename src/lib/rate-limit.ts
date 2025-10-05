type HitEntry = { count: number; ts: number }

export function rateLimit({ intervalMs, uniqueTokenPerInterval }: { intervalMs: number; uniqueTokenPerInterval: number }) {
  const hits = new Map<string, HitEntry>()

  function prune(now: number) {
    if (hits.size <= uniqueTokenPerInterval) return
    // Simple prune: remove oldest entries
    const entries = Array.from(hits.entries()).sort((a, b) => a[1].ts - b[1].ts)
    const toRemove = entries.length - uniqueTokenPerInterval
    for (let i = 0; i < toRemove; i++) hits.delete(entries[i][0])
  }

  return {
    async check(key: string, limit: number) {
      const now = Date.now()
      const entry = hits.get(key)
      if (!entry || now - entry.ts > intervalMs) {
        hits.set(key, { count: 1, ts: now })
        prune(now)
        return
      }
      entry.count += 1
      if (entry.count > limit) {
        throw new Error('Rate limit exceeded')
      }
    },
  }
}


