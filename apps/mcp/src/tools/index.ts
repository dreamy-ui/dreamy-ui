import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../lib/types";
import { getComponentPropsTool } from "./get-component";
// import { customizeThemeTool } from "./customize-theme";
// import { getComponentExampleTool } from "./get-component-example";
// import { getComponentPropsTool } from "./get-component-props";
// import { getComponentTemplatesTool } from "./get-component-templates";
// import { getThemeTool } from "./get-theme";
// import { installationTool } from "./installation";
// import { listComponentTemplatesTool } from "./list-component-templates";
// import { listComponentsTool } from "./list-components";
// import { v2ToV3MigrationTool } from "./v2-to-v3-migration";

const tools: Tool[] = [
    // getComponentExampleTool,
    getComponentPropsTool
    // getThemeTool,
    // listComponentsTool,
    // customizeThemeTool,
    // v2ToV3MigrationTool,
    // listComponentTemplatesTool,
    // getComponentTemplatesTool,
    // installationTool
];

const registeredToolCache = new Map<string, Tool>();

export const initializeTools = async (server: McpServer) => {
    // const enabledTools = tools.filter((tool) => !tool.disabled?.(config));

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
