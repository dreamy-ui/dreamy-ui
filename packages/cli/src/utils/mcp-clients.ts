export type McpClient = "claude" | "cursor" | "vscode" | "windsurf" | "codex";

export interface McpClientConfig {
	name: string;
	label: string;
	configPath: string;
	configKey: "mcpServers" | "servers";
}

export const MCP_CLIENTS: Record<McpClient, McpClientConfig> = {
	claude: {
		name: "claude",
		label: "Claude (.mcp.json)",
		configPath: ".mcp.json",
		configKey: "mcpServers"
	},
	cursor: {
		name: "cursor",
		label: "Cursor (.cursor/mcp.json)",
		configPath: ".cursor/mcp.json",
		configKey: "mcpServers"
	},
	vscode: {
		name: "vscode",
		label: "VS Code (.vscode/mcp.json)",
		configPath: ".vscode/mcp.json",
		configKey: "servers"
	},
	windsurf: {
		name: "windsurf",
		label: "Windsurf (.codeium/windsurf/mcp_config.json)",
		configPath: ".codeium/windsurf/mcp_config.json",
		configKey: "mcpServers"
	},
	codex: {
		name: "codex",
		label: "Codex (.codex/mcp.json)",
		configPath: ".codex/mcp.json",
		configKey: "mcpServers"
	}
};

export const CLIENT_NAMES = Object.keys(MCP_CLIENTS) as McpClient[];

export function isValidClient(client: string): client is McpClient {
	return CLIENT_NAMES.includes(client as McpClient);
}

export function getClientConfig(client: McpClient): McpClientConfig {
	return MCP_CLIENTS[client];
}

export interface GenerateMcpConfigOptions {
	includePanda?: boolean;
}

export function generateMcpConfig(
	clientConfig: McpClientConfig,
	options: GenerateMcpConfigOptions = {}
) {
	const servers: Record<string, { command: string; args: string[] }> = {
		"dreamy-ui": {
			command: "npx",
			args: ["-y", "@dreamy-ui/mcp"]
		}
	};

	if (options.includePanda) {
		servers.panda = {
			command: "npx",
			args: ["panda", "mcp"]
		};
	}

	return {
		[clientConfig.configKey]: servers
	};
}
