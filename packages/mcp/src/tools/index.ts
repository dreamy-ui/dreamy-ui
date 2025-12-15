import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../lib/types";
import { getComponentTool } from "./get-component";
import { getComponentsTool } from "./get-components";
import { getComponentExampleTool } from "./get-component-example";

const tools: Tool[] = [getComponentTool, getComponentsTool, getComponentExampleTool];

const registeredToolCache = new Map<string, Tool>();

export const initializeTools = async (server: McpServer) => {
	await Promise.all(
		tools.map(async (tool) => {
			const toolCtx = await tool.ctx?.();
			if (registeredToolCache.has(tool.name)) {
				return;
			}
			registeredToolCache.set(tool.name, tool);
			tool.exec(server, {
				name: tool.name,
				description: tool.description,
				ctx: toolCtx
			});
		})
	);
};
