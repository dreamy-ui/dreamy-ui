import { z } from "zod";
import { formatComponentListItem } from "../lib/format.js";
import {
	getAllComponentNames,
	getAllComponents,
	getComponentDescriptions
} from "../lib/fetch.js";
import { errorResponse, textResponse } from "../lib/response.js";
import type { Tool } from "../lib/types.js";

interface ListComponentsContext {
	componentIds: string[];
	components: Awaited<ReturnType<typeof getAllComponents>>;
}

export const listComponentsTool: Tool<ListComponentsContext> = {
	name: "list_components",
	description:
		"List or search Dreamy UI components. Returns id, name, description, and whether each has a recipe/pattern. Call this first to discover what exists, then call get_component for the ones you need.",
	async ctx() {
		const [componentIds, components] = await Promise.all([
			getAllComponentNames(),
			getAllComponents()
		]);
		return { componentIds, components };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: "List components",
				description,
				inputSchema: z.object({
					query: z
						.string()
						.optional()
						.describe(
							"Optional search filter matched against component id, name, and description (e.g. \"dialog\", \"form\", \"layout\")"
						)
				})
			},
			async function ({ query }) {
				if (!ctx.components.length) {
					return errorResponse(
						"Component list is unavailable. Ensure DREAMY_UI_BASE_URL points at a reachable Dreamy UI site (default: https://dreamy-ui.com)."
					);
				}

				const descriptions = await getComponentDescriptions(ctx.componentIds);
				const normalizedQuery = query?.trim().toLowerCase();

				const items = ctx.components
					.map(function (component) {
						return {
							id: component.id,
							component: component.component,
							description: descriptions.get(component.id),
							hasRecipe: component.hasRecipe,
							hasPattern: component.hasPattern,
							installCommand: component.installCommand
						};
					})
					.filter(function (item) {
						if (!normalizedQuery) {
							return true;
						}

						const haystack = [
							item.id,
							item.component,
							item.description ?? ""
						]
							.join(" ")
							.toLowerCase();

						return haystack.includes(normalizedQuery);
					});

				const lines = [
					`# Dreamy UI components (${items.length})`,
					"",
					normalizedQuery
						? `Filtered by query: \`${normalizedQuery}\``
						: "All components. Pass `query` to filter (e.g. \"overlay\", \"input\").",
					"",
					...items.map(formatComponentListItem),
					"",
					"Next: call `get_component` with a component id for props, variants, and usage."
				];

				return textResponse(lines.join("\n"));
			}
		);
	}
};

/** Backward-compatible alias */
export const getComponentsTool = {
	...listComponentsTool,
	name: "get_components",
	description:
		"Alias of list_components. List or search Dreamy UI components with descriptions. Prefer list_components."
} satisfies Tool<ListComponentsContext>;
