import type { SerializeFrom } from "@remix-run/node";
import {
    type ClientLoaderFunctionArgs,
    useLoaderData,
    useNavigate,
    useRouteLoaderData
} from "@remix-run/react";
import { useState } from "react";
import { useSafeLayoutEffect } from "../../../../packages/react/src/components/descendant/utils";

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
    console.log("CLIENT LOADER isHydrated", isHydrated());

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
    const navigate = useNavigate();
    const [currentData, setCurrentData] = useState<any>(loaderData);

    // Unpack deferred data from the server
    useSafeLayoutEffect(() => {
        console.log("loaderData", loaderData);
        (window as any).cacheKey = loaderData?.key;
        if (loaderData?.serverLoaderPromise) {
            loaderData.serverLoaderPromise
                .then((newData: any) => {
                    /**
                     * Checking if the page has changed, since page can be changed, before the promise resolves.
                     */
                    if ((window as any).cacheKey !== loaderData?.key) return;

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
    }, [loaderData]);

    return {
        ...currentData,
        cacheKey: loaderData?.key
    } as SerializeFrom<T> & {
        cacheKey?: string;
    };
}

export function useCachedRouteLoaderData<T extends any>(routeKey: string) {
    const loaderData = useRouteLoaderData<any>(routeKey);
    const navigate = useNavigate();
    const [currentData, setCurrentData] = useState<any>(loaderData);

    // Unpack deferred data from the server
    useSafeLayoutEffect(() => {
        if (loaderData?.serverLoaderPromise) {
            loaderData.serverLoaderPromise
                .then((newData: any) => {
                    // set only if the page hasn't changed

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
    }, [loaderData]);

    return {
        ...currentData,
        cacheKey: loaderData?.key
    } as SerializeFrom<T> & {
        cacheKey?: string;
    };
}

function constructKey(request: Request) {
    const url = new URL(request.url);
    return url.pathname + url.search + url.hash;
}

export function isHydrated() {
    return !!(window as any).hydrated;
}

export function cachePageData(slug: string) {
    return fetch(`${slug}?_data=routes%2Fdocs.%24section.%24page`)
        .then((res) => res.json())
        .then((data) => {
            clientCache.setItem(slug, JSON.stringify(data));
        });
}
