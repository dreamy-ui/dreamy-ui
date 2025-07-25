import { AsyncLocalStorage } from "node:async_hooks";
import type { unstable_MiddlewareFunction, unstable_RouterContextProvider } from "react-router";

interface RequestContext {
    timings: Map<string, number>;
    request: Request;
    context: unstable_RouterContextProvider;
}

const requestStorage = new AsyncLocalStorage<RequestContext>();

export const requestMiddleware: unstable_MiddlewareFunction = async (
    { context, request },
    next
) => {
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

export const timingsMiddleware: unstable_MiddlewareFunction = async (_, next) => {
    const response = (await next()) as Response;
    const timings = getTimings();

    // map over the timings and add them to the response headers
    let serverTiming = "";
    timings.forEach((value, key) => {
        serverTiming += `${key};dur=${value.toFixed(2)};`;
    });
    response.headers.append("Server-Timing", serverTiming);

    return response;
};
