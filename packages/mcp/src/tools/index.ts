import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../lib/types.js";
import { getComponentTool } from "./get-component.js";
import { getComponentExampleTool, getComponentExamplesTool } from "./get-component-example.js";
import { getComponentSourceTool } from "./get-component-source.js";
import { getComponentsTool, listComponentsTool } from "./get-components.js";

const tools: Tool[] = [
	listComponentsTool,
	getComponentTool,
	getComponentExamplesTool,
	getComponentSourceTool,
	// Backward-compatible aliases
	getComponentsTool,
	getComponentExampleTool
];

const registeredToolCache = new Map<string, Tool>();

function getDefaultToolContext(toolName: string) {
	switch (toolName) {
		case "list_components":
		case "get_components":
			return { componentIds: [], components: [] };
		default:
			return { componentIds: [] };
	}
}

export async function initializeTools(server: McpServer) {
	await Promise.all(
		tools.map(async function (tool) {
			if (registeredToolCache.has(tool.name)) {
				return;
			}

			let toolCtx: unknown;

			try {
				toolCtx = await tool.ctx?.();
			} catch (error) {
				console.error(
					`Dreamy UI MCP: failed to initialize tool "${tool.name}":`,
					error instanceof Error ? error.message : error
				);
				toolCtx = getDefaultToolContext(tool.name);
			}

			registeredToolCache.set(tool.name, tool);
			tool.exec(server, {
				name: tool.name,
				description: tool.description,
				ctx: toolCtx ?? getDefaultToolContext(tool.name)
			});
		})
	);
}
