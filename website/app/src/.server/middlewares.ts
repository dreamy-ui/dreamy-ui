import { AsyncLocalStorage } from "node:async_hooks";
import type { MiddlewareFunction, RouterContextProvider } from "react-router";

interface RequestContext {
    timings: Map<string, number>;
    request: Request;
    context: Readonly<RouterContextProvider>;
}

const requestStorage = new AsyncLocalStorage<RequestContext>();

export const requestMiddleware: MiddlewareFunction = async ({ context, request }, next) => {
    const start = performance.now();

    const response = (await requestStorage.run(
        {
            timings: new Map(),
            request,
            context
        },
        next
    )) as Response;

    const end = performance.now();
    response.headers.set("X-Response-Time", (end - start).toFixed(2) + "ms");

    return response;
};

export function getRequest() {
    const store = requestStorage.getStore();
    if (!store) {
        throw new Error("Request not found");
    }
    return store.request;
}

export function getTimings() {
    const store = requestStorage.getStore();
    if (!store) {
        throw new Error("Request not found");
    }
    return store.timings;
}

export function getContext() {
    const store = requestStorage.getStore();
    if (!store) {
        throw new Error("Request not found");
    }
    return store.context;
}

export const timingsMiddleware: MiddlewareFunction = async (_, next) => {
    const response = (await next()) as Response;
    const timings = getTimings();

    let serverTiming = "";

    let index = 0;
    for (const [key, value] of timings.entries()) {
        serverTiming += `${key};dur=${value.toFixed(2)}${index < timings.size - 1 ? ", " : ""}`;
        index++;
    }

    if (serverTiming) {
        response.headers.append("Server-Timing", serverTiming);
    }

    return response;
};

export const prefetchCacheControlHeaderMiddleware: MiddlewareFunction = async (
    { request },
    next
) => {
    const response = (await next()) as Response;

    if (request.headers.get("sec-purpose") === "prefetch") {
        response.headers.append("Cache-Control", "private, max-age=10");
    }

    return response;
};
