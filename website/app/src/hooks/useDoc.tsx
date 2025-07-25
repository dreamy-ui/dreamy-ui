import type { Route } from "../../routes/+types/docs.$section.$page";
import { useCachedRouteLoaderData } from "../functions/clientCache";

export function useDoc() {
	return useCachedRouteLoaderData<Route.ComponentProps["loaderData"]>(
		"routes/docs.$section.$page"
	);
}
