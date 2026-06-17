import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestLogger } from "evlog";
import type { RouterContextProvider } from "react-router";

interface RequestContext {
    timings: Map<string, number>;
    request: Request;
    context: Readonly<RouterContextProvider>;
    log: RequestLogger;
}

export const requestStorage = new AsyncLocalStorage<RequestContext>();

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
