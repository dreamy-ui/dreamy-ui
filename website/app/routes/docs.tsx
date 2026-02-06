import { Flex } from "@/ui";
import { createError } from "evlog";
import { Outlet } from "react-router";
import { sectionsContext, sectionsMiddleware } from "~/src/.server/middlewares";
import MobileDocsNav from "~/src/ui/docs/MobileDocsNav";
import OnThisPage from "~/src/ui/docs/OnThisPage";
import SectionsNav from "~/src/ui/docs/SectionsNav";
import type { Route } from "./+types/docs";

export const middleware = [sectionsMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
    const sections = context.get(sectionsContext);
    if (!sections) {
        throw createError({
            message: "Sections not found",
            cause: new Error("Sections not found")
        });
    }

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
