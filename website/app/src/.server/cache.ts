import type { Cache, CacheEntry, CachifiedOptions } from "@epic-web/cachified";
import { cachified as baseCachified, totalTtl } from "@epic-web/cachified";
import type { HeadersFunction } from "@remix-run/node";
import { LRUCache } from "lru-cache";

/**
 * Cache control headers
 */
export class CacheHeaders {
    public static cache(
        maxAge: CACHE_DURATION,
        headersInit?: ReturnType<HeadersFunction>,
        skipVary = false // skip the vary header, mostly used for responses
    ): ReturnType<HeadersFunction> {
        const headers = new Headers(headersInit);

        if (!skipVary) {
            headers.append("Vary", "Cookie, Accept-Encoding");
        }

        if (process.env.NODE_ENV === "production")
            headers.append(
                "Cache-Control",
                `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=604800`
            );

        return headers;
    }
}

export enum CACHE_DURATION {
    DEFAULT = 60 * 5
}

/**
 * LRU for docs
 */
const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 });

interface LruCache extends Cache {
    clear(): void;
}

export const lru: LruCache = {
    set(key, value) {
        const ttl = totalTtl(value?.metadata);
        return lruInstance.set(key, value, {
            ttl: ttl === Number.POSITIVE_INFINITY ? undefined : ttl,
            start: value?.metadata?.createdTime
        });
    },
    get(key) {
        return lruInstance.get(key);
    },
    delete(key) {
        return lruInstance.delete(key);
    },
    clear() {
        lruInstance.clear();
    }
};

export function cachified<Value>(options: Omit<CachifiedOptions<Value>, "cache">) {
    return baseCachified({
        cache: lru,
        ttl: 15 * 60, // 15 minutes is the default TTL
        ...options
    });
}
