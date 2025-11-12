import cluster from "node:cluster";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext, unstable_ServerInstrumentation } from "react-router";
import { ServerRouter } from "react-router";
import { Docs } from "~/src/.server/docs";
import { lru } from "./src/.server/cache";
import { Logger } from "./src/.server/logger";
import { stripHost, timing } from "./src/functions/instrumentation";

export const streamTimeout = 5000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext
	// _context: RouterContextProvider
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

export const unstable_instrumentations: unstable_ServerInstrumentation[] = [
	{
		handler(handler) {
			handler.instrument({
				async request(handleRequest, { request }) {
					const time = timing();
					await handleRequest();
					Logger.info(`${request.method} ${stripHost(request.url)} - ${time()}ms`, true);
				}
			});
		},
		route(route) {
			route.instrument({
				async loader(callLoader, { request }) {
					const time = timing();
					await callLoader();
					Logger.info(
						`Loader ${request.method} ${stripHost(request.url)} - ${time()}ms`,
						true
					);
				},
				async middleware(callMiddleware, { request }) {
					const time = timing();
					await callMiddleware();
					Logger.info(
						`Middleware ${request.method} ${stripHost(request.url)} - ${time()}ms`,
						true
					);
				},
				async action(callAction, { request }) {
					const time = timing();
					await callAction();
					Logger.info(
						`Action ${request.method} ${stripHost(request.url)} - ${time()}ms`,
						true
					);
				},
				async lazy(callLazy) {
					const time = timing();
					await callLazy();
					Logger.info(`Lazy ${time()}ms`, true);
				}
			});
		}
	}
];
