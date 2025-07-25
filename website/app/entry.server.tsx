import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import cluster from "node:cluster";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type {
	EntryContext,
	unstable_RouterContextProvider
} from "react-router";
import { ServerRouter } from "react-router";
import { Docs } from "~/src/.server/docs";
import { lru } from "./src/.server/cache";

export const streamTimeout = 5000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
	_context: unstable_RouterContextProvider
) {
	return new Promise((resolve, reject) => {
		let shellRendered = false;

		const isBot = isbot(request.headers.get("user-agent"));

		const resolver = isBot ? "onAllReady" : "onShellReady";

		const { pipe } = renderToPipeableStream(
			<ServerRouter context={reactRouterContext} url={request.url} />,
			{
				[resolver]() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

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

if (cluster.isPrimary) {
	Docs.fetchDocsOnStartup();
}

if (process.env.NODE_ENV === "development") {
	lru.clear();
}
