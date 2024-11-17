import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Docs } from "~/src/.server/docs";
import { filenameToSlug } from "~/src/functions/string";

export async function loader(_: LoaderFunctionArgs) {
    const sections = await Docs.getSections();

    throw redirect(
        `/docs/${filenameToSlug(sections[0].title)}/${filenameToSlug(sections[0].sections[0].name)}`
    );
}
