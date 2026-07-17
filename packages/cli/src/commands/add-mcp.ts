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
	panda?: boolean;
}

interface InstallDreamyMcpOptions {
	clients?: McpClient[];
	includePanda?: boolean;
	/** Skip interactive prompts and use defaults where possible */
	useDefaults?: boolean;
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

export async function installDreamyMcp(
	cwd: string,
	options: InstallDreamyMcpOptions = {}
): Promise<boolean> {
	let clients = options.clients;
	let includePanda = options.includePanda;

	if (includePanda === undefined) {
		if (options.useDefaults) {
			includePanda = true;
		} else {
			const addPanda = await p.confirm({
				message: "Also add the Panda CSS MCP server?",
				initialValue: true
			});

			if (p.isCancel(addPanda)) {
				p.log.warn("⊘ Skipped MCP setup");
				return false;
			}

			includePanda = addPanda;
		}
	}

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
			p.log.warn("⊘ Skipped MCP setup");
			return false;
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
		p.log.error("No valid clients selected.");
		return false;
	}

	const results: { client: McpClient; path: string }[] = [];

	for (const client of validClients) {
		const clientConfig = getClientConfig(client);
		const configPath = resolve(cwd, clientConfig.configPath);
		const configDir = dirname(configPath);

		if (!existsSync(configDir)) {
			mkdirSync(configDir, { recursive: true });
		}

		const newConfig = generateMcpConfig(clientConfig, { includePanda });
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

	p.log.success(
		includePanda
			? "✓ MCP setup complete! Your AI assistants can now use Dreamy UI and Panda CSS tools."
			: "✓ MCP setup complete! Your AI assistants can now use Dreamy UI tools."
	);

	return true;
}

export const AddMcpCommand = new Command("add-mcp")
	.description("Add the Dreamy UI MCP server to AI client configs")
	.option("--cwd <cwd>", "Current working directory", process.cwd())
	.option(
		"--client <clients>",
		"AI clients to configure (claude, cursor, vscode, windsurf, codex)"
	)
	.option("--panda", "Also add the Panda CSS MCP server")
	.option("--no-panda", "Do not add the Panda CSS MCP server")
	.action(async function addMcpAction(flags: AddMcpCommandFlags) {
		const cwd = resolve(flags.cwd ?? process.cwd());
		const clients = parseClients(flags.client);

		p.intro("Dreamy UI MCP Setup");

		const success = await installDreamyMcp(cwd, {
			clients,
			includePanda: flags.panda
		});

		if (!success) {
			p.cancel("Setup cancelled.");
			process.exit(0);
		}

		p.outro("MCP setup complete!");
	});
