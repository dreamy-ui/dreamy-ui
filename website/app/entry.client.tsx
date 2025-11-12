import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { unstable_ClientInstrumentation } from "react-router";
import { HydratedRouter } from "react-router/dom";
import { stripHost, timing } from "./src/functions/instrumentation";

const unstable_instrumentations: unstable_ClientInstrumentation[] = [
	{
		router(router) {
			router.instrument({
				async navigate(callNavigate, { currentUrl, to }) {
					to = to.toString();
					const time = timing();
					await callNavigate();
					console.log(
						`Navigation ${stripHost(currentUrl)} → ${stripHost(to)} - ${time()}ms`
					);
				},
				async fetch(callFetch, { href, fetcherKey }) {
					const time = timing();
					await callFetch();
					console.log(`Fetcher ${fetcherKey} → ${href} - ${time()}ms`);
				}
			});
		},

		route(route) {
			// if (route.id === "root") return;

			route.instrument({
				async loader(callLoader, { request }) {
					const time = timing();
					await callLoader();
					console.log(`Loader ${request.method} ${stripHost(request.url)} - ${time()}ms`);
				},
				async middleware(callMiddleware, { request }) {
					const time = timing();
					await callMiddleware();
					console.log(
						`Middleware ${request.method} ${stripHost(request.url)} - ${time()}ms`
					);
				},
				async action(callAction, { request }) {
					const time = timing();
					await callAction();
					console.log(`Action ${request.method} ${stripHost(request.url)} - ${time()}ms`);
				},
				async lazy(callLazy) {
					const time = timing();
					await callLazy();
					console.log(`Lazy ${time()}ms`);
				}
			});
		}
	}
];

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<HydratedRouter unstable_instrumentations={unstable_instrumentations} />
		</StrictMode>
	);
});
