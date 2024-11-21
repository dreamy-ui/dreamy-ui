import { type ActionFunctionArgs, data } from "@remix-run/node";
import { cachified } from "~/src/.server/cache";
import { Docs, filenameToTitle } from "~/src/.server/docs";
import { invariant } from "~/src/functions/invariant";

export async function action({ request }: ActionFunctionArgs) {
    try {
        const form = await request.formData();

        const query = form.get("query") as string;

        invariant(query, "query is required");

        if (query.length < 1 && query.length > 25) {
            throw new Error("query must be between 1 and 25");
        }

        const docs = await cachified({
            key: `docs-search-${query}`,
            getFreshValue: async () => {
                const docs = (
                    await Promise.all(
                        (
                            await Docs.getSections()
                        ).flatMap(async (doc) => {
                            const files = doc.sections;

                            return await Promise.all(
                                files.map(async (file) => {
                                    // const docFile = await Docs.getDoc(
                                    //     doc.title.toLowerCase(),
                                    //     file.name
                                    // );

                                    return {
                                        filename: file.name,
                                        // content: docFile?.content,
                                        path: file.slug
                                    };
                                })
                            );
                        })
                    )
                ).flat();

                const names = docs.filter((doc) => {
                    return doc.filename.toLowerCase().includes(query.toLowerCase());
                });

                // const docsByContent = new Array<(typeof names)[number]>();

                // if names are less than 10, search by content to fill up the gap to 10 found docs
                // if (names.length < 10) {
                //     const missingDocsNumber = 10 - names.length;
                //     const foundDocs = docs.filter((doc) => {
                //         return doc.content?.toLowerCase().includes(query.toLowerCase());
                //     });

                //     if (foundDocs.length) {
                //         for (let i = 0; i < Math.min(missingDocsNumber, foundDocs.length); i++) {
                //             if (names.find((doc) => doc.filename === foundDocs[i].filename))
                //                 continue;

                //             docsByContent.push(foundDocs[i]);
                //         }
                //     }
                // }

                const result = names.map((doc) => {
                    return {
                        ...doc,
                        filename: filenameToTitle(doc.filename)
                    };
                });

                return result;
            }
        });

        return {
            docs
        };
    } catch (e) {
        if (e instanceof Error) {
            console.log(e);
            return data({ error: e.message }, { status: 500 });
        }
        throw e;
    }
}

// function removeContent(doc: {
//     filename: string;
//     content: string | undefined;
//     path: string;
// }) {
//     return copyObjectWithoutKeys(doc, ["content"]);
// }
