import type { unstable_MiddlewareFunction } from "react-router";

export const clientTimingMiddleware: unstable_MiddlewareFunction = async (_, next) => {
	const start = performance.now();

	await next();

	const end = performance.now();

	console.log(`Navigation took: ${(end - start).toFixed(2)}ms`);
};
