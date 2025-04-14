import { filenameToSlug } from "../functions/string";
import { Docs } from "./docs";

export async function getFullLLMDocs() {
    const sections = await Docs.getSections();

    console.log(JSON.stringify(sections, null, 2));

    const docsContentsPromises = sections.flatMap((section) => {
        return section.sections.map((page) => {
            return Docs.getDoc(filenameToSlug(section.title), filenameToSlug(page.name));
        });
    });

    const docsContents = await Promise.allSettled(docsContentsPromises).then((results) => {
        return results.map((result) => {
            if (result.status === "fulfilled") {
                return result.value;
            }

            console.error("Failed to get doc for llms.txt", result.reason);

            return null;
        });
    });

    const docsContentsString = docsContents
        .map((doc) => {
            return doc?.content ?? "";
        })
        .join("\n");

    return `<SYSTEM>This is the full developer documentation for Dreamy UI.</SYSTEM>
   
${docsContentsString}`;
}
