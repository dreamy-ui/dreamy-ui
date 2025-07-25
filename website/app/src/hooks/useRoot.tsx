import { useRouteLoaderData } from "react-router";
import type { Route } from "../../+types/root";

export function useRoot() {
	const root = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root");
	if (!root) {
		throw new Error("Root not found");
	}
	return root;
}
