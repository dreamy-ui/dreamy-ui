import { createError } from "evlog";
import { Docs } from "~/src/.server/docs";
import { getTimings, sectionsContext } from "~/src/.server/middlewares";
import type { Route } from "./+types/docs.$section.$page[.mdx]";

export async function loader({ params, context }: Route.LoaderArgs) {
    const section = params.section as string;
    const page = params.page as string;

    const sections = context.get(sectionsContext);
    if (!sections) {
        throw createError({
            message: "Sections not found",
            cause: new Error("Sections not found")
        });
    }

    const start = performance.now();
    const doc = await Docs.getDoc(section, page, sections).catch((e) => {
        console.error(e);
        return null;
    });
    const end = performance.now();
    getTimings().set("doc", end - start);

    if (!doc || !doc.content) {
        throw new Response(null, {
            status: 404,
            statusText: "Page Not Found"
        });
    }

    return new Response(doc.content, {
        headers: {
            "Content-Type": "text/markdown"
        }
    });
}
