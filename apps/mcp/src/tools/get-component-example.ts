import { z } from "zod";
import { getAllComponentNames, getComponentExample } from "../lib/fetch.js";
import type { Tool } from "../lib/types.js";

export const getComponentExampleTool: Tool<{ componentList: string[] }> = {
	name: "get_component_example",
	description:
		"Get example code for a specific Dreamy UI component. This tool retrieves the example code for a given Dreamy UI component.",
	async ctx() {
		try {
			const componentList = await getAllComponentNames();
			console.error("componentList", componentList);

			return { componentList };
		} catch (error) {
			throw new Error(
				`Failed to initialize get component example tool: ${error instanceof Error ? error.message : "Unknown error"}`
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
						.describe("The name of the Dreamy UI component to get example of")
				})
			},
			async ({ component }) => {
				try {
					component = component.toLowerCase();

					const doc = await getComponentExample(component);

					return {
						content: [
							{
								type: "text",
								text: doc
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
