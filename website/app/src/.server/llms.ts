import { Docs } from "./docs";

export async function getFullLLMDocs() {
    const sections = await Docs.getSections();

    console.log(JSON.stringify(sections, null, 2));

    const docsContentsPromises = sections.map((section) => {
        return Docs.getDoc(
            section.title.toLowerCase(),
            section.sections[0].name.toLowerCase()
        ).catch((e) => {
            console.error("Failed to get doc for llms.txt", e);
            throw e;
        });
    });

    const docsContents = await Promise.all(docsContentsPromises);

    const docsContentsString = docsContents
        .map((doc) => {
            return doc?.content ?? "";
        })
        .join("\n");

    return `<SYSTEM>This is the full developer documentation for Dreamy UI.</SYSTEM>
   
${docsContentsString}`;
}
