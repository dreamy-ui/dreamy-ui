import type {
    ActionFunctionArgs,
    AppLoadContext,
    EntryContext,
    LoaderFunctionArgs
} from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import cluster from "node:cluster";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Docs } from "~/src/.server/docs";
import { Logger } from "~/src/.server/logger";
import { lru } from "./src/.server/cache";

export const streamTimeout = 5000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: AppLoadContext
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;

        const isBot = isbot(request.headers.get("user-agent"));

        const resolver = isBot ? "onAllReady" : "onShellReady";

        const { pipe } = renderToPipeableStream(
            <RemixServer
                context={remixContext}
                url={request.url}
            />,
            {
                [resolver]() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");
                    const timingValue = `${(performance.now() - loadContext.start).toFixed(2)}ms`;
                    responseHeaders.set("X-Render-Time", timingValue);
                    Logger.debug("Rendered In: " + timingValue);

                    if (Object.keys(loadContext.timings).length > 0) {
                        responseHeaders.set(
                            "Server-Timing",
                            Object.entries(loadContext.timings)
                                .map(([key, value]) => `${key};dur=${value}`)
                                .join(", ")
                        );
                    }

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode
                        })
                    );

                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    if (shellRendered) {
                        console.error(error);
                    }
                }
            }
        );
    });
}

export function handleDataRequest(
    response: Response,
    { context }: LoaderFunctionArgs | ActionFunctionArgs
) {
    response.headers.set("X-Timing", (performance.now() - context.start).toFixed(2) + "ms");

    if (Object.keys(context.timings).length > 0) {
        response.headers.set(
            "Server-Timing",
            Object.entries(context.timings)
                .map(([key, value]) => `${key};dur=${value.toFixed(2)}`)
                .join(", ")
        );
    }

    return response;
}

if (cluster.isPrimary) {
    Docs.fetchDocsOnStartup();
}

if (process.env.NODE_ENV === "development") {
    lru.clear();
}
