import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as p from "@clack/prompts";
import { Command } from "commander";
import {
	CLIENT_NAMES,
	generateMcpConfig,
	getClientConfig,
	isValidClient,
	MCP_CLIENTS,
	type McpClient
} from "../utils/mcp-clients";

interface AddMcpCommandFlags {
	cwd?: string;
	client?: string | string[];
}

function parseClients(clientFlag: string | string[] | undefined): McpClient[] | undefined {
	if (!clientFlag) {
		return undefined;
	}

	return (Array.isArray(clientFlag) ? clientFlag : [clientFlag])
		.flatMap(function splitClients(value) {
			return value.split(",");
		})
		.map(function trimClient(value) {
			return value.trim();
		})
		.filter(Boolean) as McpClient[];
}

export const AddMcpCommand = new Command("add-mcp")
	.description("Add the Dreamy UI MCP server to AI client configs")
	.option("--cwd <cwd>", "Current working directory", process.cwd())
	.option(
		"--client <clients>",
		"AI clients to configure (claude, cursor, vscode, windsurf, codex)"
	)
	.action(async function addMcpAction(flags: AddMcpCommandFlags) {
		const cwd = resolve(flags.cwd ?? process.cwd());
		let clients = parseClients(flags.client);

		p.intro("Dreamy UI MCP Setup");

		if (!clients || clients.length === 0) {
			const selected = await p.multiselect({
				message: "Select AI clients to configure:",
				options: CLIENT_NAMES.map(function mapClientOption(client) {
					return {
						value: client,
						label: MCP_CLIENTS[client].label
					};
				}),
				required: true
			});

			if (p.isCancel(selected)) {
				p.cancel("Setup cancelled.");
				process.exit(0);
			}

			clients = selected as McpClient[];
		}

		const validClients = clients.filter(function filterValidClient(client) {
			if (!isValidClient(client)) {
				p.log.warn(`Unknown client: ${client}`);
				return false;
			}
			return true;
		});

		if (validClients.length === 0) {
			p.cancel("No valid clients selected.");
			process.exit(1);
		}

		const results: { client: McpClient; path: string }[] = [];

		for (const client of validClients) {
			const clientConfig = getClientConfig(client);
			const configPath = resolve(cwd, clientConfig.configPath);
			const configDir = dirname(configPath);

			if (!existsSync(configDir)) {
				mkdirSync(configDir, { recursive: true });
			}

			const newConfig = generateMcpConfig(clientConfig);
			let finalConfig = newConfig;

			if (existsSync(configPath)) {
				try {
					const existingContent = readFileSync(configPath, "utf-8");
					const existingConfig = JSON.parse(existingContent);

					finalConfig = {
						...existingConfig,
						[clientConfig.configKey]: {
							...existingConfig[clientConfig.configKey],
							...newConfig[clientConfig.configKey]
						}
					};
				} catch {
					// If parsing fails, use new config
				}
			}

			writeFileSync(configPath, `${JSON.stringify(finalConfig, null, 2)}\n`);

			results.push({
				client,
				path: clientConfig.configPath
			});
		}

		p.note(
			results
				.map(function formatResult(result) {
					return `${result.client}: ${result.path}`;
				})
				.join("\n"),
			"Created MCP configurations"
		);

		p.outro("MCP setup complete! Your AI assistants can now use Dreamy UI tools.");
	});
