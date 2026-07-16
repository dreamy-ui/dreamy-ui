import { z } from "zod";
import {
    fetchDocsSafe,
    getAllComponentNames,
    getComponentIndex,
    resolveComponentId
} from "../lib/fetch.js";
import { formatExamples } from "../lib/format.js";
import { parseDocs } from "../lib/parse-docs.js";
import { errorResponse, textResponse } from "../lib/response.js";
import { componentIdSchema } from "../lib/schema.js";
import type { Tool } from "../lib/types.js";

interface GetComponentExamplesContext {
    componentIds: string[];
}

export const getComponentExamplesTool: Tool<GetComponentExamplesContext> = {
    name: "get_component_examples",
    description:
        "Get official usage examples for a Dreamy UI component, parsed from docs into titled code snippets (variants, sizes, controlled mode, etc.). Use after get_component when you need more patterns.",
    async ctx() {
        const componentIds = await getAllComponentNames();
        return { componentIds };
    },
    exec(server, { ctx, name, description }) {
        server.registerTool(
            name,
            {
                title: "Get component examples",
                description,
                inputSchema: z.object({
                    component: componentIdSchema(ctx.componentIds),
                    limit: z
                        .number()
                        .int()
                        .min(1)
                        .max(30)
                        .optional()
                        .describe("Max number of examples to return (default: all)")
                })
            },
            async ({ component, limit }) => {
                const componentIndex = await getComponentIndex();
                const componentId = resolveComponentId(component, componentIndex) ?? component;
                const indexItem = componentIndex.find((item) => item.id === componentId);
                const result = await fetchDocsSafe(componentId);

                if (!result.ok) {
                    return errorResponse(result.error);
                }

                const docs = parseDocs(result.data);
                const title = docs.frontmatter.title ?? indexItem?.component ?? componentId;
                const exportName = indexItem?.component ?? title.replace(/\s+/g, "");
                const markdown = [
                    `# ${title} examples`,
                    "",
                    docs.frontmatter.description ?? "",
                    "",
                    `Import: \`import { ${exportName} } from "@/ui";\``,
                    "",
                    formatExamples(docs, limit)
                ].join("\n");

                return textResponse(markdown);
            }
        );
    }
};

/** Backward-compatible alias */
export const getComponentExampleTool = {
    ...getComponentExamplesTool,
    name: "get_component_example",
    description: "Alias of get_component_examples. Prefer get_component_examples."
} satisfies Tool<GetComponentExamplesContext>;
