import { z } from "zod";
import { getComponentData } from "../lib/component-data.js";
import {
	getAllComponentNames,
	getComponentIndex,
	resolveComponentId
} from "../lib/fetch.js";
import { errorResponse, textResponse } from "../lib/response.js";
import { componentIdSchema } from "../lib/schema.js";
import type { Tool } from "../lib/types.js";

interface GetComponentContext {
	componentIds: string[];
}

export const getComponentTool: Tool<GetComponentContext> = {
	name: "get_component",
	description:
		"Get source code, recipes, and patterns for a Dreamy UI component. Returns component source, all linked recipe/pattern files (resolved by recipeIds/patternIds), install command, and dependencies.",
	async ctx() {
		const componentIds = await getAllComponentNames();
		return { componentIds };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: name,
				description,
				inputSchema: z.object({
					component: componentIdSchema(ctx.componentIds)
				})
			},
			async ({ component }) => {
				const componentIndex = await getComponentIndex();
				const componentId = resolveComponentId(component, componentIndex) ?? component;
				const result = await getComponentData(componentId);

				if (!result.ok) {
					return errorResponse(result.error);
				}

				return textResponse(result.data);
			}
		);
	}
};
