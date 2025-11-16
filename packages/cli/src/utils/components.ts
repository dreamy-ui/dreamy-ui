import * as p from "@clack/prompts";
import { boxen } from "@visulima/boxen";
import { convertTsxToJsx } from "./convert-tsx-to-jsx";
import type { CompositionFile, Compositions } from "./schema";

export async function transformToJsx(item: CompositionFile) {
    const content = await convertTsxToJsx(item.file.content);
    item.file.content = content;
    item.file.name = item.file.name.replace(".tsx", ".jsx");
}

export function printFileSync(item: CompositionFile) {
    const boxText = boxen(item.file.content, {
        headerText: `${item.file.name}\n`,
        borderStyle: "none"
    });
    p.log.info(boxText);
}

export function printRecipeSync({
    content,
    filename
}: {
    content: string;
    filename: string;
}) {
    const boxText = boxen(content, {
        headerText: `Recipe: ${filename}\n`,
        borderStyle: "none"
    });
    p.log.info(boxText);
}

export function printPatternSync({
    content,
    filename
}: {
    content: string;
    filename: string;
}) {
    const boxText = boxen(content, {
        headerText: `Pattern: ${filename}\n`,
        borderStyle: "none"
    });
    p.log.info(boxText);
}

export const RECOMMENDED_COMPONENTS = ["button", "flex", "text", "heading"];

export function getComponents(opts: {
    components: string[];
    all: boolean | undefined;
    items: Compositions;
}) {
    const { components, all, items } = opts;
    if (components.length === 0 && !all)
        return {
            message: "No components selected, adding recommended components...",
            items: RECOMMENDED_COMPONENTS
        };

    if (all)
        return {
            message: "Adding all components...",
            items: items.map((item) => item.id)
        };

    return {
        message: `Adding ${components.length} component${components.length > 1 ? "s" : ""}...`,
        items: components
    };
}
