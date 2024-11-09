import { Flex } from "@dreamy-ui/react/rsc";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { type ClientLoaderFunctionArgs, Outlet } from "@remix-run/react";
import { memo } from "react";
import { Docs } from "~/src/.server/docs";
import { cacheClientLoader, useCachedRouteLoaderData } from "~/src/functions/clientCache";
import MobileDocsNav from "~/src/ui/docs/MobileDocsNav";
import OnThisPage from "~/src/ui/docs/OnThisPage";
import SectionsNav from "~/src/ui/docs/SectionsNav";

export async function loader(_: LoaderFunctionArgs) {
    const sections = await Docs.getSections();

    return {
        sections
    };
}

export const clientLoader = (args: ClientLoaderFunctionArgs) =>
    cacheClientLoader(args, {
        key: "/docs"
    });
clientLoader.hydrate = true;

export function shouldRevalidate() {
    return false;
}

export function useSections() {
    return useCachedRouteLoaderData<typeof loader>("routes/docs");
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
            <MemoSectionsNav />

            <MemoMobileDocsNav />

            <Outlet />

            <MemoOnThisPage />
        </Flex>
    );
}

const MemoSectionsNav = memo(SectionsNav);
const MemoOnThisPage = memo(OnThisPage);
const MemoMobileDocsNav = memo(MobileDocsNav);
// const MemoOutlet = memo(Outlet);
