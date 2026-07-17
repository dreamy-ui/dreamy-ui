import { z } from "zod";
import { getComponentSourceBundle } from "../lib/component-data.js";
import { getAllComponentNames, getComponentIndex, resolveComponentId } from "../lib/fetch.js";
import { errorResponse, textResponse } from "../lib/response.js";
import { componentIdSchema } from "../lib/schema.js";
import type { Tool } from "../lib/types.js";

interface GetComponentSourceContext {
    componentIds: string[];
}

export const getComponentSourceTool: Tool<GetComponentSourceContext> = {
    name: "get_component_source",
    description:
        "Get the full TypeScript source for a Dreamy UI component plus linked recipe/pattern style files. Use only when you need to customize internals or debug styling — prefer get_component for normal usage.",
    async ctx() {
        const componentIds = await getAllComponentNames();
        return { componentIds };
    },
    exec(server, { ctx, name, description }) {
        server.registerTool(
            name,
            {
                title: "Get component source",
                description,
                inputSchema: z.object({
                    component: componentIdSchema(ctx.componentIds),
                    includeRecipes: z
                        .boolean()
                        .optional()
                        .describe("Include recipe source files (default: true)"),
                    includePatterns: z
                        .boolean()
                        .optional()
                        .describe("Include pattern source files (default: true)")
                })
            },
            async ({ component, includeRecipes = true, includePatterns = true }) => {
                const componentIndex = await getComponentIndex();
                const componentId = resolveComponentId(component, componentIndex) ?? component;
                const result = await getComponentSourceBundle(componentId);

                if (!result.ok) {
                    return errorResponse(result.error);
                }

                const data = result.data;
                const parts: string[] = [
                    `# ${data.component} source`,
                    "",
                    `Install: \`${data.installCommand}\``,
                    "",
                    `## ${data.source.name}`,
                    "",
                    "```tsx",
                    data.source.content,
                    "```"
                ];

                if (includeRecipes) {
                    for (const recipe of data.recipes) {
                        parts.push(
                            "",
                            `## Recipe: ${recipe.id} (${recipe.file.name})`,
                            "",
                            "```ts",
                            recipe.file.content,
                            "```"
                        );
                    }
                }

                if (includePatterns) {
                    for (const pattern of data.patterns) {
                        parts.push(
                            "",
                            `## Pattern: ${pattern.id} (${pattern.file.name})`,
                            "",
                            "```ts",
                            pattern.file.content,
                            "```"
                        );
                    }
                }

                if (data.warnings.length) {
                    parts.push("", "## Warnings", "");
                    for (const warning of data.warnings) {
                        parts.push(`- ${warning}`);
                    }
                }

                return textResponse(parts.join("\n"));
            }
        );
    }
};
