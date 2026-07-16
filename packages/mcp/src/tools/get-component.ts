import { z } from "zod";
import { getComponentReference } from "../lib/component-data.js";
import { formatComponentReference } from "../lib/format.js";
import {
	getAllComponentNames,
	getComponentIndex,
	resolveComponentId
} from "../lib/fetch.js";
import { getPrimaryExample } from "../lib/parse-docs.js";
import { errorResponse, textResponse } from "../lib/response.js";
import { componentIdSchema } from "../lib/schema.js";
import type { Tool } from "../lib/types.js";

interface GetComponentContext {
	componentIds: string[];
}

export const getComponentTool: Tool<GetComponentContext> = {
	name: "get_component",
	description:
		"Get an LLM-ready reference for a Dreamy UI component: description, install/import, compound API exports, styling variants (variant/size/scheme), props with types & JSDoc, and a primary usage example. Prefer this before writing UI code. Use get_component_examples for more snippets, or get_component_source for full source files.",
	async ctx() {
		const componentIds = await getAllComponentNames();
		return { componentIds };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: "Get component API",
				description,
				inputSchema: z.object({
					component: componentIdSchema(ctx.componentIds)
				})
			},
			async function ({ component }) {
				const componentIndex = await getComponentIndex();
				const componentId = resolveComponentId(component, componentIndex) ?? component;
				const result = await getComponentReference(componentId);

				if (!result.ok) {
					return errorResponse(result.error);
				}

				const data = result.data;
				const markdown = formatComponentReference({
					id: data.id,
					component: data.component,
					description: data.description,
					docsUrl: data.docsUrl,
					installCommand: data.installCommand,
					npmDependencies: data.npmDependencies,
					fileDependencies: data.fileDependencies,
					exports: data.exports,
					interfaces: data.interfaces,
					recipe: data.recipe,
					pattern: data.pattern,
					primaryExample: data.docs ? getPrimaryExample(data.docs) : undefined,
					warnings: data.warnings
				});

				return textResponse(markdown);
			}
		);
	}
};
