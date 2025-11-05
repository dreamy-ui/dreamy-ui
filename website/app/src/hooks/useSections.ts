import { useRouteLoaderData } from "react-router";
import type { Route } from "../../routes/+types/docs";

export function useSections() {
    const sections = useRouteLoaderData<Route.ComponentProps["loaderData"]>("routes/docs");
    if (!sections) {
        throw new Error("Sections not found");
    }
    return sections;
}
