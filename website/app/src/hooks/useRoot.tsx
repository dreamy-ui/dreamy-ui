import { useRouteLoaderData } from "@remix-run/react";
import type { loader } from "~/root";

export function useRoot() {
	return useRouteLoaderData<typeof loader>("root")!;
}
