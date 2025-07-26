import { Flex } from "@/flex";
import { Outlet } from "react-router";
import { Docs } from "~/src/.server/docs";
import { getTimings } from "~/src/.server/middlewares";
import { cacheClientLoader } from "~/src/functions/clientCache";
import MobileDocsNav from "~/src/ui/docs/MobileDocsNav";
import OnThisPage from "~/src/ui/docs/OnThisPage";
import SectionsNav from "~/src/ui/docs/SectionsNav";
import type { ServerLoader } from "~/types";
import type { Route } from "./+types/docs";

export async function loader(_: Route.LoaderArgs) {
    const start = performance.now();
    const sections = await Docs.getSections();
    const end = performance.now();
    getTimings().set("sections", end - start);

    return {
        sections
    };
}

export const clientLoader = (args: Route.ClientLoaderArgs) =>
    cacheClientLoader<ServerLoader<typeof loader>>(args, {
        key: "/docs"
    });
clientLoader.hydrate = true;

export function shouldRevalidate() {
    return false;
}

export default function DocsLayout() {
    return (
        <Flex
            pos="relative"
            flexDir={{
                base: "column",
                md: "row"
            }}
            justifyContent="space-between"
            full
            gap={5}
        >
            <SectionsNav />
            <MobileDocsNav />
            <Outlet />
            <OnThisPage />
        </Flex>
    );
}
