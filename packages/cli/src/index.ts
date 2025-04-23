import * as p from "@clack/prompts";
import { Command } from "commander";
import { createRequire } from "node:module";
import { ComponentsCommand } from "./commands/components";

process.setMaxListeners(Number.POSITIVE_INFINITY);

const req = createRequire(import.meta.url);
const packageJson = req("@dreamy-ui/cli/package.json");

export async function run() {
	p.intro("Dreamy UI CLI 💫");
	const program = new Command()
		.name("dreamy-ui")
		.description("The official CLI for Dreamy UI projects")
		.version(packageJson.version);

	program.addCommand(ComponentsCommand);

	program.parse();
}
