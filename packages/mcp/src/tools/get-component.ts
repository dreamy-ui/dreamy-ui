import { z } from "zod";
import { fetchComponent, fetchRecipe, getAllComponentNames } from "../lib/fetch.js";
import type { Tool } from "../lib/types.js";

export const getComponentTool: Tool<{ componentList: string[] }> = {
	name: "get_component",
	description:
		"Get whole data of a specific Dreamy UI component. This tool retrieves the properties, attributes, design related props for a component, like size, variant, etc. and configuration options available for a given Dreamy UI component.",
	async ctx() {
		try {
			const componentList = await getAllComponentNames();
			return { componentList };
		} catch (error) {
			throw new Error(
				`Failed to initialize get component tool: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: name,
				description: description,
				inputSchema: z.object({
					component: z
						.enum(ctx.componentList as [string, ...string[]])
						.describe("The name of the Dreamy UI component to get data of")
				})
			},
			async ({ component }) => {
				try {
					const [componentJson, recipe] = await Promise.all([
						fetchComponent(component),
						fetchRecipe(component)
					]);

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(componentJson)
							},
							{
								type: "text",
								text: JSON.stringify(recipe)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Failed to get data of ${component}: ${error instanceof Error ? error.message : "Unknown error"}`
							}
						]
					};
				}
			}
		);
	}
};
