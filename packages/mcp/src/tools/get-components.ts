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
							'Optional search filter matched against component id, name, and description. Space-separated terms match any term (e.g. "dialog", "button input modal", "layout")'
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
				const queryTerms =
					query
						?.trim()
						.toLowerCase()
						.split(/\s+/)
						.filter(Boolean) ?? [];

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
						if (!queryTerms.length) {
							return true;
						}

						const haystack = [
							item.id,
							item.component,
							item.description ?? ""
						]
							.join(" ")
							.toLowerCase();

						return queryTerms.some(function (term) {
							return haystack.includes(term);
						});
					});

				const lines = [
					`# Dreamy UI components (${items.length})`,
					"",
					queryTerms.length
						? `Filtered by query: \`${queryTerms.join(" ")}\``
						: 'All components. Pass `query` to filter (e.g. "overlay", "button input modal").',
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
