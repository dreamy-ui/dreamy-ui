import { z } from "zod";
import {
	DOCS_CATALOG,
	getDocsCatalogIds,
	resolveDocsEntry,
	type DocsCatalogEntry
} from "../lib/docs-catalog.js";
import { fetchDocSafe, getBaseUrl } from "../lib/fetch.js";
import { parseFrontmatterOnly, stripMdxForLlm } from "../lib/parse-docs.js";
import { errorResponse, textResponse } from "../lib/response.js";
import type { Tool } from "../lib/types.js";

interface DocsToolContext {
	docIds: string[];
}

function formatDocsListItem(entry: DocsCatalogEntry): string {
	const description = entry.description ? ` — ${entry.description}` : "";
	return `- \`${entry.id}\` **${entry.title}**${description}`;
}

function isComponentDocRequest(input: string): boolean {
	const normalized = input.trim().toLowerCase().replace(/^\/docs\//, "").replace(/\.mdx$/, "");
	return normalized.startsWith("components/") || normalized.startsWith("component/");
}

export const listDocsTool: Tool<DocsToolContext> = {
	name: "list_docs",
	description:
		"List Dreamy UI documentation pages (guide, ai-agents, frameworks, theming, hooks). Excludes component docs — use list_components / get_component for those. Optional query filters by id, title, or description.",
	async ctx() {
		return { docIds: getDocsCatalogIds() };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: "List docs",
				description,
				inputSchema: z.object({
					query: z
						.string()
						.optional()
						.describe(
							'Optional search filter (e.g. "theming", "tokens", "hooks", "install")'
						)
				})
			},
			async function ({ query }) {
				const normalizedQuery = query?.trim().toLowerCase();

				const items = DOCS_CATALOG.filter(function (entry) {
					if (!normalizedQuery) {
						return true;
					}

					const haystack = [entry.id, entry.title, entry.description, entry.section]
						.join(" ")
						.toLowerCase();

					return haystack.includes(normalizedQuery);
				});

				const bySection = new Map<string, DocsCatalogEntry[]>();

				for (const entry of items) {
					const list = bySection.get(entry.section) ?? [];
					list.push(entry);
					bySection.set(entry.section, list);
				}

				const lines = [
					`# Dreamy UI docs (${items.length})`,
					"",
					"Component documentation is not listed here. Use `list_components` / `get_component` instead.",
					"",
					normalizedQuery
						? `Filtered by query: \`${normalizedQuery}\``
						: `All non-component docs (${ctx.docIds.length} total). Pass \`query\` to filter.`,
					""
				];

				for (const [section, entries] of bySection) {
					lines.push(`## ${section}`, "");
					for (const entry of entries) {
						lines.push(formatDocsListItem(entry));
					}
					lines.push("");
				}

				lines.push("Next: call `get_doc` with a doc id (e.g. `theming/tokens`).");

				return textResponse(lines.join("\n"));
			}
		);
	}
};

export const getDocTool: Tool<DocsToolContext> = {
	name: "get_doc",
	description:
		"Get a Dreamy UI documentation page as markdown (guide, theming, frameworks, hooks, ai-agents). Does not return component docs — use get_component / get_component_examples for those. Pass a doc id from list_docs (e.g. theming/tokens, guide/installation).",
	async ctx() {
		return { docIds: getDocsCatalogIds() };
	},
	exec(server, { ctx, name, description }) {
		server.registerTool(
			name,
			{
				title: "Get doc",
				description,
				inputSchema: z.object({
					doc: z
						.string()
						.min(1)
						.describe(
							ctx.docIds.length > 0
								? `Doc id from list_docs (e.g. ${ctx.docIds.slice(0, 3).join(", ")})`
								: "Doc id like theming/tokens or guide/installation"
						)
				})
			},
			async function ({ doc }) {
				if (isComponentDocRequest(doc)) {
					return errorResponse(
						"Component docs are not available via get_doc. Use get_component or get_component_examples with the component id instead."
					);
				}

				const entry = resolveDocsEntry(doc);

				if (!entry) {
					const hint =
						ctx.docIds.length > 0
							? ` Known ids include: ${ctx.docIds.slice(0, 8).join(", ")}…`
							: "";
					return errorResponse(
						`Unknown doc "${doc}". Call list_docs to see available pages.${hint}`
					);
				}

				const result = await fetchDocSafe(entry.section, entry.page);

				if (!result.ok) {
					return errorResponse(result.error);
				}

				const { frontmatter, body } = parseFrontmatterOnly(result.data);
				const markdown = stripMdxForLlm(body);
				const title = frontmatter.title ?? entry.title;
				const description = frontmatter.description ?? entry.description;
				const docsUrl = `${getBaseUrl()}${entry.path}`;

				const lines = [
					`# ${title}`,
					"",
					description ? `> ${description}` : "",
					description ? "" : null,
					`Source: ${docsUrl}`,
					`Doc id: \`${entry.id}\``,
					"",
					markdown
				].filter(function (line) {
					return line !== null;
				});

				return textResponse(lines.join("\n"));
			}
		);
	}
};
