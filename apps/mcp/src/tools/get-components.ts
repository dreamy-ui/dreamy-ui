import { ExtendedComponentIndexItem, getAllComponents } from "../lib/fetch.js";
import type { Tool } from "../lib/types.js";

export const getComponentsTool: Tool<{ componentList: ExtendedComponentIndexItem[] }> = {
	name: "get_components",
	description:
		"Get whole data of all Dreamy UI components. This tool retrieves the all possible components, their recipe and pattern ids, their file dependencies and also",
	async ctx() {
		try {
			const componentList = await getAllComponents();

			return { componentList };
		} catch (error) {
			throw new Error(
				`Failed to initialize component props tool: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: name,
				description: description
			},
			async () => {
				try {
					const componentList = ctx.componentList;

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(componentList)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Failed to get data of all components: ${error instanceof Error ? error.message : "Unknown error"}`
							}
						]
					};
				}
			}
		);
	}
};
