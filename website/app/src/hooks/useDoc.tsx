import type { loader } from "~/routes/docs.$section.$page";
import { useCachedRouteLoaderData } from "../functions/clientCache";

export function useDoc() {
    return useCachedRouteLoaderData<typeof loader>("routes/docs.$section.$page");
}
