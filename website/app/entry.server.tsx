import type {
    ActionFunctionArgs,
    AppLoadContext,
    EntryContext,
    LoaderFunctionArgs
} from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Docs } from "~/src/.server/docs";
import { Logger } from "~/src/.server/logger";

const ABORT_DELAY = 5_000;

const redirects = [
    {
        path: "/discord",
        redirect: "https://discord.gg/gTSuFWnWy8"
    }
];

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: AppLoadContext
) {
    for (const redirect of redirects) {
        if (new URL(request.url).pathname === redirect.path) {
            return Response.redirect(redirect.redirect, 302);
        }
    }

    return new Promise((resolve, reject) => {
        let shellRendered = false;

        const isBot = isbot(request.headers.get("user-agent"));

        const resolver = isBot ? "onAllReady" : "onShellReady";

        const { pipe, abort } = renderToPipeableStream(
            <RemixServer
                context={remixContext}
                url={request.url}
                abortDelay={ABORT_DELAY}
            />,
            {
                [resolver]() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");
                    const timingValue = `${(performance.now() - loadContext.start).toFixed(2)}ms`;
                    responseHeaders.set("X-Timing", timingValue);
                    Logger.debug("Rendered In: " + timingValue);

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

        setTimeout(abort, ABORT_DELAY);
    });
}

export function handleDataRequest(
    response: Response,
    { context }: LoaderFunctionArgs | ActionFunctionArgs
) {
    response.headers.set("X-Timing", (performance.now() - context.start).toFixed(2) + "ms");
    return response;
}

Docs.fetchDocsOnStartup();