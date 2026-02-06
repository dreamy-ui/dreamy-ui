import { AsyncLocalStorage } from "node:async_hooks";
import { type RequestLogger, createRequestLogger } from "evlog";
import { type MiddlewareFunction, type RouterContextProvider, createContext } from "react-router";
import { Docs, type Sections } from "./docs";

interface RequestContext {
    timings: Map<string, number>;
    request: Request;
    context: Readonly<RouterContextProvider>;
    log: RequestLogger;
}

const requestStorage = new AsyncLocalStorage<RequestContext>();

export const requestMiddleware: MiddlewareFunction = async ({ context, request }, next) => {
    const start = performance.now();

    const log = createRequestLogger({
        method: request.method,
        path: new URL(request.url).pathname
    });
    log.set({ type: request.headers.get("sec-fetch-dest") === "document" ? "document" : "data" });

    const response = (await requestStorage.run(
        {
            timings: new Map(),
            request,
            context,
            log
        },
        next
    )) as Response;

    const end = performance.now();
    response.headers.set("X-Response-Time", (end - start).toFixed(2) + "ms");

    log.emit();

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

export function log() {
    const store = requestStorage.getStore();
    if (!store) {
        throw new Error("Request not found");
    }
    return store.log;
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

export const sectionsContext = createContext<Sections | null>(null);

export const sectionsMiddleware: MiddlewareFunction = async ({ context }, _next) => {
    const start = performance.now();
    const sections = await Docs.getSections();
    const end = performance.now();
    getTimings().set("sections", end - start);
    context.set(sectionsContext, sections);
};
