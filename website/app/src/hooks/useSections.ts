import type { Route } from "../../routes/+types/docs";
import { useCachedRouteLoaderData } from "../functions/clientCache";

export function useSections() {
	return useCachedRouteLoaderData<Route.ComponentProps["loaderData"]>(
		"routes/docs"
	);
}
