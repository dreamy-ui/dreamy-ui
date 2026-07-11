import { getAllComponents } from "../lib/fetch.js";
import { errorResponse, textResponse } from "../lib/response.js";
import type { Tool } from "../lib/types.js";

interface GetComponentsContext {
	components: Awaited<ReturnType<typeof getAllComponents>>;
}

export const getComponentsTool: Tool<GetComponentsContext> = {
	name: "get_components",
	description:
		"List all Dreamy UI components with metadata: ids, recipe/pattern ids, file dependencies, npm dependencies, and install commands.",
	async ctx() {
		const components = await getAllComponents();
		return { components };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: name,
				description
			},
			async () => {
				if (!ctx.components.length) {
					return errorResponse(
						"Component list is unavailable. Ensure the Dreamy UI website is running and DREAMY_UI_BASE_URL is set correctly."
					);
				}

				return textResponse({
					count: ctx.components.length,
					components: ctx.components
				});
			}
		);
	}
};
