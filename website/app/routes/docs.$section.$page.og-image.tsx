import type { LoaderFunctionArgs } from "react-router";
import { cachified } from "~/src/.server/cache";
import { Docs } from "~/src/.server/docs";
import { generateOgImage } from "~/src/.server/og-image";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const section = params.section as string;
    const page = params.page as string;

    return cachified({
        key: `og-image-${section}-${page}`,
        getFreshValue: async () => {
            const doc = await Docs.getDoc(section, page)
                .catch(() => {
                    return null;
                })
                .then((doc) => {
                    if (!doc) {
                        throw new Response(null, {
                            status: 404
                        });
                    }
                    return doc;
                });

            const image = await generateOgImage(
                doc.mdxContent.frontmatter.title as string,
                doc.mdxContent.frontmatter.description as string,
                new URL(request.url).origin
            );

            return new Response(image, {
                headers: {
                    "Content-Type": "image/png",
                    "Cache-Control": "public, s-maxage=31536000, immutable"
                }
            });
        }
    });
}
