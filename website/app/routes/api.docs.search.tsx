import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Docs, filenameToTitle } from "~/src/.server/docs";
import { invariant } from "~/src/functions/invariant";
import { copyObjectWithoutKeys } from "~/src/functions/objects";

export async function action({ request }: ActionFunctionArgs) {
    try {
        const form = await request.formData();

        const query = form.get("query") as string;

        invariant(query, "query is required");

        if (query.length < 1 && query.length > 25) {
            throw new Error("query must be between 1 and 25");
        }

        const docs = Docs.getDocsAsArray().flatMap((doc) => {
            const files = doc[1].files;

            return files.map((file) => {
                return {
                    filename: file.filename,
                    content: file.content,
                    path: `/docs/${doc[0]}/${file.filename}`
                };
            });
        });

        const names = docs.filter((doc) => {
            return doc.filename.toLowerCase().includes(query.toLowerCase());
        });

        const docsByContent = new Array<(typeof names)[number]>();

        // if names are less than 10, search by content to fill up the gap to 10 found docs
        if (names.length < 10) {
            const missingDocsNumber = 10 - names.length;
            const foundDocs = docs.filter((doc) => {
                return doc.content?.toLowerCase().includes(query.toLowerCase());
            });

            if (foundDocs.length) {
                for (let i = 0; i < Math.min(missingDocsNumber, foundDocs.length); i++) {
                    if (names.find((doc) => doc.filename === foundDocs[i].filename)) continue;

                    docsByContent.push(foundDocs[i]);
                }
            }
        }

        const result = [...names, ...docsByContent].map((doc) => {
            const woContent = removeContent(doc);
            return {
                ...woContent,
                filename: filenameToTitle(woContent.filename)
            };
        });

        return json({
            docs: result
        });
    } catch (e) {
        if (e instanceof Error) {
            console.log(e);
            return json({ error: e.message }, { status: 500 });
        }
        throw e;
    }
}

function removeContent(doc: {
    filename: string;
    content: string | null;
    path: string;
}) {
    return copyObjectWithoutKeys(doc, ["content"]);
}
