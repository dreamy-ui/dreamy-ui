import * as p from "@clack/prompts";
import { Command } from "commander";
import { ComponentsCommand } from "./commands/components";

process.setMaxListeners(Number.POSITIVE_INFINITY);

export async function run() {
	p.intro("Dreamy UI CLI 💫");
	const packageJson = await import("@dreamy-ui/cli/package.json");

	const program = new Command()
		.name("dreamy-ui")
		.description("The official CLI for Dreamy UI projects")
		.version(packageJson.version);

	program.addCommand(ComponentsCommand);

	program.parse();
}
