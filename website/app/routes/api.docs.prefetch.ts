import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";
import { Docs } from "~/src/.server/docs";
import type { Route } from "./+types/api.docs.prefetch";

export async function loader({ request }: Route.LoaderArgs) {
    const searchParams = new URL(request.url).searchParams;

    const splitted = searchParams.get("slug")?.split("/") ?? [];
    const section = splitted[2] as string;
    const page = splitted[3] as string;

    const doc = await Docs.getDoc(section, page).catch((e) => {
        console.error(e);
        return null;
    });

    if (!doc) {
        throw Response.json(null, {
            status: 404
        });
    }

    return Response.json(
        {
            mdxSource: doc.mdxContent,
            mdxDescription: doc.mdxFrontmatterDescription,
            frontmatter: doc.mdxContent.frontmatter,
            headings: doc.headings
        },
        {
            headers: CacheHeaders.cache(CACHE_DURATION.DEFAULT, undefined, true)
        }
    );
}
