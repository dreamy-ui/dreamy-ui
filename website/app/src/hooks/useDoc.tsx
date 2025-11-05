import { useRouteLoaderData } from "react-router";
import type { Route } from "../../routes/+types/docs.$section.$page";

export function useDoc() {
    const doc = useRouteLoaderData<Route.ComponentProps["loaderData"]>(
        "routes/docs.$section.$page"
    );
    if (!doc) {
        throw new Error("Doc not found");
    }
    return doc;
}
