import { useSafeLayoutEffect } from "@dreamy-ui/react";
import type { SerializeFrom } from "@remix-run/node";
import {
    type ClientLoaderFunctionArgs,
    useLoaderData,
    useNavigate,
    useRouteLoaderData
} from "@remix-run/react";
import { useState } from "react";

export interface CacheAdapter {
    getItem: (key: string) => any | Promise<any>;
    setItem: (key: string, value: any) => Promise<any> | any;
    removeItem: (key: string) => Promise<any> | any;
}

const clientCache: CacheAdapter = {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, val) => localStorage.setItem(key, val),
    removeItem: async (key) => localStorage.removeItem(key)
};

export const cacheClientLoader = async <T extends unknown>(
    { request, serverLoader }: ClientLoaderFunctionArgs,
    { key = constructKey(request) }: { key?: string; adapter?: CacheAdapter } = {
        key: constructKey(request)
    }
): Promise<
    SerializeFrom<T> & {
        serverData: SerializeFrom<T>;
        deferredServerData: Promise<SerializeFrom<T>> | undefined;
        key: string;
    }
> => {
    const existingData = isHydrated() ? await clientCache.getItem(key) : undefined;
    const data = existingData ? JSON.parse(existingData) : await serverLoader();

    if (!existingData) clientCache.setItem(key, JSON.stringify(data));

    const serverLoaderPromise = existingData ? serverLoader() : undefined;

    return {
        ...data,
        serverLoaderPromise,
        key
    };
};

export function useCachedLoaderData<T extends any>() {
    const loaderData = useLoaderData<any>();

    return useClientCache<T>(loaderData);
}

export function useCachedRouteLoaderData<T extends any>(routeKey: string) {
    const loaderData = useRouteLoaderData<any>(routeKey);

    return useClientCache<T>(loaderData);
}

function useClientCache<T extends any>(loaderData: any) {
    const navigate = useNavigate();
    const [currentData, setCurrentData] = useState<any>(loaderData);

    // Unpack deferred data from the server
    useSafeLayoutEffect(() => {
        let cacheKeys = getCacheKeys();
        cacheKeys.add(loaderData?.key);

        (window as any).cacheKeys = cacheKeys;

        // (window as any).cacheKey = loaderData?.key;
        if (loaderData?.serverLoaderPromise) {
            loaderData.serverLoaderPromise
                .then((newData: any) => {
                    /**
                     * Checking if the page has changed, since page can be changed, before the promise resolves.
                     */
                    cacheKeys = getCacheKeys();
                    if (!cacheKeys.has(loaderData?.key)) {
                        return;
                    }

                    const newDataString = JSON.stringify(newData);
                    if (newDataString !== JSON.stringify(currentData)) {
                        if (loaderData?.key) clientCache.setItem(loaderData.key, newDataString);
                        setCurrentData(newData);
                    }
                })
                .catch((e: any) => {
                    const res = e instanceof Response ? e : undefined;
                    if (res && res.status === 302) {
                        const to = res.headers.get("Location");
                        to && navigate(to);
                    } else {
                        throw e;
                    }
                });
        }
        if (JSON.stringify(loaderData) !== JSON.stringify(currentData)) {
            setCurrentData(loaderData);
        }

        return () => {
            cacheKeys = getCacheKeys();
            cacheKeys.delete(loaderData?.key);
            (window as any).cacheKeys = cacheKeys;
        };
    }, [loaderData]);

    return {
        ...currentData,
        cacheKey: loaderData?.key
    } as SerializeFrom<T> & {
        cacheKey?: string;
    };
}

function getCacheKeys() {
    return ((window as any).cacheKeys as Set<string> | undefined) || new Set<string>();
}

function constructKey(request: Request) {
    const url = new URL(request.url);
    return url.pathname + url.search + url.hash;
}

export function isHydrated() {
    return !!(window as any).hydrated;
}

export function cachePageData(slug: string) {
    return fetch(`/api/docs/prefetch?slug=${slug}`)
        .then((res) => res.json())
        .then((data) => {
            clientCache.setItem(slug, JSON.stringify(data));
        });
}
