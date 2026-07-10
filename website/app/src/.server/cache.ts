import type { Cache, CacheEntry, CachifiedOptions } from "@epic-web/cachified";
import { cachified as baseCachified, totalTtl } from "@epic-web/cachified";
import { remember } from "@epic-web/remember";
import { LRUCache } from "lru-cache";
import type { HeadersFunction } from "react-router";
import { minToMs } from "./docs";
import { env } from "./env";

/**
 * Cache control headers
 */
export class CacheHeaders {
    public static cache(
        maxAge: CACHE_DURATION,
        headersInit?: ReturnType<HeadersFunction>,
        skipVary = false
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
    DEFAULT = 60 * 5,
    ONE_WEEK = 60 * 60 * 24 * 7,
    ONE_MONTH = 60 * 60 * 24 * 30
}

const lruInstance = remember("lru", () => {
    return new LRUCache<string, CacheEntry>({ max: 1000 });
});

interface LruCache extends Cache {
    clear(): void;
}

export const lru: LruCache = {
    async set(key, value) {
        const ttl = totalTtl(value?.metadata);
        return lruInstance.set(key, value, {
            ttl: ttl === Number.POSITIVE_INFINITY ? undefined : ttl,
            start: value?.metadata?.createdTime
        });
    },
    async get(key) {
        return lruInstance.get(key) ?? null;
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
        ttl: env.NODE_ENV === "production" ? minToMs(15) : 0,
        staleWhileRevalidate: env.NODE_ENV === "production" ? minToMs(45) : 0,
        ...options
    });
}
