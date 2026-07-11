import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../lib/types.js";
import { getComponentTool } from "./get-component.js";
import { getComponentsTool } from "./get-components.js";
import { getComponentExampleTool } from "./get-component-example.js";

const tools: Tool[] = [getComponentTool, getComponentsTool, getComponentExampleTool];

const registeredToolCache = new Map<string, Tool>();

function getDefaultToolContext(toolName: string) {
	switch (toolName) {
		case "get_components":
			return { components: [] };
		default:
			return { componentIds: [] };
	}
}

export async function initializeTools(server: McpServer) {
	await Promise.all(
		tools.map(async (tool) => {
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
