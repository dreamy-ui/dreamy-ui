import { z } from "zod";
import {
	getAllComponentNames,
	getComponentExampleSafe,
	getComponentIndex,
	resolveComponentId
} from "../lib/fetch.js";
import { errorResponse, textResponse } from "../lib/response.js";
import { componentIdSchema } from "../lib/schema.js";
import type { Tool } from "../lib/types.js";

interface GetComponentExampleContext {
	componentIds: string[];
}

export const getComponentExampleTool: Tool<GetComponentExampleContext> = {
	name: "get_component_example",
	description:
		"Get MDX documentation and usage examples for a Dreamy UI component, including installation, usage snippets, and live demo references.",
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
				const result = await getComponentExampleSafe(componentId);

				if (!result.ok) {
					return errorResponse(result.error);
				}

				return textResponse({
					id: componentId,
					documentation: result.data
				});
			}
		);
	}
};
