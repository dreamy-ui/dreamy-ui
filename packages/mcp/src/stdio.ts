#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server";
import { initializeTools } from "./tools";

async function main() {
    await initializeTools(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
	console.error("Dreamy UI MCP fatal error:", error instanceof Error ? error.message : error);
	process.exit(1);
});
