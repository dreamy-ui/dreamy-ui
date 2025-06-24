import { exec } from "node:child_process";
import { promisify } from "node:util";
import { detect } from "package-manager-detector";

const execAsync = promisify(exec);

interface PackageManager {
	run: (script: string, args: string) => string;
	add: (args: string[], isDev?: boolean) => string;
	install: string;
	codegen: string;
}

const commandMap: Record<string, PackageManager> = {
	npm: {
		run: (script: string, args: string) => `npm run ${script} -- ${args}`,
		add: (args: string[], isDev?: boolean) =>
			`npm install ${isDev ? "-D" : ""}${args.join(" ")}`,
		install: "npm install",
		codegen: "npx panda codegen --silent"
	},
	yarn: {
		run: (script: string, args: string) => `yarn ${script} ${args}`,
		add: (args: string[], isDev?: boolean) =>
			`yarn add ${isDev ? "-D" : ""}${args.join(" ")}`,
		install: "yarn",
		codegen: "yarn panda codegen --silent"
	},
	pnpm: {
		run: (script: string, args: string) => `pnpm run ${script} -- ${args}`,
		add: (args: string[], isDev?: boolean) =>
			`pnpm add ${isDev ? "-D" : ""}${args.join(" ")}`,
		install: "pnpm install",
		codegen: "pnpm panda codegen --silent"
	},
	bun: {
		run: (script: string, args: string) => `bun run ${script} -- ${args}`,
		add: (args: string[], isDev?: boolean) =>
			`bun install ${isDev ? "-D" : ""}${args.join(" ")}`,
		install: "bun install",
		codegen: "bun panda codegen --silent"
	}
};

export async function installCommand(args: string[], cwd?: string) {
	const res = await detect({ cwd });
	const agent = res?.agent?.split("@")[0] || "npm";
	try {
		const command = Reflect.get(commandMap, agent);
		const str = command.add(args);
		await execAsync(str, { cwd, encoding: "utf-8" });
	} catch (error) {
		console.error(error);
	}
}

export async function pandaCodegenCommand(cwd?: string) {
	const res = await detect({ cwd });
	const agent = res?.agent?.split("@")[0] || "npm";
	try {
		const command = Reflect.get(commandMap, agent);
		const str = command.codegen;
		await execAsync(str, { cwd, encoding: "utf-8" });
	} catch (error) {
		console.error(error);
	}
}
