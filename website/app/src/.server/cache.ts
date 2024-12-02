import type { Cache, CacheEntry, CachifiedOptions } from "@epic-web/cachified";
import { cachified as baseCachified, totalTtl } from "@epic-web/cachified";
import { remember } from "@epic-web/remember";
import type { HeadersFunction } from "@remix-run/node";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";
import { Logger } from "~/src/.server/logger";
import { env } from "./env";

/**
 * Cache control headers
 */
export class CacheHeaders {
    public static cache(
        maxAge: CACHE_DURATION,
        headersInit?: ReturnType<HeadersFunction>,
        skipVary = false // skip the vary header, mostly used for non-document responses
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

/**
 * LRU for docs
 */
const useRedis = !!env.REDIS_URL;
const lruInstance = useRedis
    ? undefined
    : remember("lru", () => new LRUCache<string, CacheEntry>({ max: 1000 }));
const redisInstance = useRedis
    ? remember("redis", () => {
          const redis = new Redis(env.REDIS_URL as string);
          redis.once("ready", () => {
              Logger.success("Redis is ready");
          });

          return redis;
      })
    : undefined;

Logger.info(`Using ${useRedis ? "Redis" : "LRU"} cache`);

interface LruCache extends Cache {
    clear(): void;
}

export const lru: LruCache = {
    async set(key, value) {
        const ttl = totalTtl(value?.metadata);
        if (lruInstance) {
            return lruInstance.set(key, value, {
                ttl: ttl === Number.POSITIVE_INFINITY ? undefined : ttl,
                start: value?.metadata?.createdTime
            });
        }
        return await redisInstance?.set(key, JSON.stringify(value), "PX", ttl);
    },
    async get(key) {
        if (lruInstance) {
            return lruInstance.get(key);
        }
        const start = performance.now();
        const redisValue = await redisInstance?.get(key);
        const end = performance.now();
        Logger.debug(`Redis get ${key} took ${end - start}ms`);
        if (!redisValue) {
            return null;
        }
        try {
            return JSON.parse(redisValue);
        } catch (_) {
            return redisValue;
        }
    },
    delete(key) {
        if (lruInstance) {
            return lruInstance.delete(key);
        }
        return redisInstance?.del(key);
    },
    clear() {
        if (lruInstance) {
            lruInstance.clear();
        }
        return redisInstance?.flushdb();
    }
};

export function cachified<Value>(options: Omit<CachifiedOptions<Value>, "cache">) {
    return baseCachified({
        cache: lru,
        ttl: 15 * 60, // 15 minutes is the default TTL
        ...options
    });
}
