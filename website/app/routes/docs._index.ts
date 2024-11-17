import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Docs } from "~/src/.server/docs";

export async function loader(_: LoaderFunctionArgs) {
    const sections = await Docs.getSections();

    throw redirect(`/docs/${sections[0].title}/${sections[0].sections[0].name}`);
}
