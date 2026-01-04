import { Flex } from "@/ui";
import { Outlet } from "react-router";
import { Docs } from "~/src/.server/docs";
import { getTimings } from "~/src/.server/middlewares";
import MobileDocsNav from "~/src/ui/docs/MobileDocsNav";
import OnThisPage from "~/src/ui/docs/OnThisPage";
import SectionsNav from "~/src/ui/docs/SectionsNav";
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

export function shouldRevalidate() {
    return false;
}

export default function DocsLayout() {
    return (
        <Flex
            flexDir={{
                base: "column",
                md: "row"
            }}
            full
            gap={5}
            justifyContent="space-between"
            pos="relative"
        >
            <SectionsNav />
            <MobileDocsNav />
            <Outlet />
            <OnThisPage />
        </Flex>
    );
}
