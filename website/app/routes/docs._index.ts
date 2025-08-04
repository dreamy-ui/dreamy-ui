import { redirect } from "react-router";
import { Docs } from "~/src/.server/docs";
import { filenameToSlug } from "~/src/functions/string";
import type { Route } from "./+types/docs._index";

export async function loader(_: Route.LoaderArgs) {
    const sections = await Docs.getSections();

    throw redirect(
        `/docs/${filenameToSlug(sections[0].title)}/${filenameToSlug(sections[0].sections[0].name)}`
    );
}
