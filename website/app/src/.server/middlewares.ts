import { createRequestLogger } from "evlog";
import { type MiddlewareFunction, createContext, redirect } from "react-router";
import redirects from "~/redirects";
import { getTimings, requestStorage } from "~/src/.server/als";
import { Docs, type Sections } from "./docs";

const redirectMap = new Map<string, string>();

for (const entry of redirects) {
    const paths = Array.isArray(entry.path) ? entry.path : [entry.path];

    for (const path of paths) {
        redirectMap.set(path, entry.redirect);
    }
}

function normalizePathname(pathname: string) {
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }

    return pathname;
}

export const redirectsMiddleware: MiddlewareFunction = async ({ url }, next) => {
    const pathname = normalizePathname(url.pathname);
    const destination = redirectMap.get(pathname);

    if (destination) {
        throw redirect(destination);
    }

    return next();
};

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
