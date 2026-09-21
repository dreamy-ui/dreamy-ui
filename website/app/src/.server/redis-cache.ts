import type { Cache, CacheEntry } from "@epic-web/cachified";
import { totalTtl } from "@epic-web/cachified";
import { remember } from "@epic-web/remember";
import { createClient } from "redis";

const KEY_PREFIX = "dreamy-ui:cache:";

function prefixedKey(key: string) {
    return `${KEY_PREFIX}${key}`;
}

export interface ClearableCache extends Cache {
    clear(): void | Promise<void>;
}

export function createRedisCache(redisUrl: string): ClearableCache {
    const client = remember(`redis-client:${redisUrl}`, () => {
        const redis = createClient({ url: redisUrl });
        redis.on("error", (error) => {
            console.error("[redis-cache]", error);
        });
        void redis.connect();
        return redis;
    });

    return {
        async set(key, value) {
            const ttl = totalTtl(value?.metadata);
            const payload = JSON.stringify(value);
            const redisKey = prefixedKey(key);

            if (ttl !== Number.POSITIVE_INFINITY && ttl > 0) {
                await client.set(redisKey, payload, { PX: ttl });
                return;
            }

            await client.set(redisKey, payload);
        },
        async get(key) {
            const raw = await client.get(prefixedKey(key));
            if (!raw) return null;
            return JSON.parse(raw) as CacheEntry;
        },
        delete(key) {
            return client.del(prefixedKey(key)).then(() => undefined);
        },
        async clear() {
            for await (const key of client.scanIterator({ MATCH: `${KEY_PREFIX}*`, COUNT: 100 })) {
                await client.del(key);
            }
        }
    };
}
