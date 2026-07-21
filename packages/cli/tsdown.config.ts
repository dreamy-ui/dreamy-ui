import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

const root = dirname(fileURLToPath(import.meta.url));

function resolveNodeEnv() {
	if (process.env.NODE_ENV) {
		return process.env.NODE_ENV;
	}

	const script = process.env.npm_lifecycle_event;
	if (script === "build:production") {
		return "production";
	}

	return "development";
}

const nodeEnv = resolveNodeEnv();
const envFile = join(root, `.env.${nodeEnv}`);
const fallbackEnvFile = join(root, ".env");

if (existsSync(envFile)) {
	process.loadEnvFile(envFile);
} else if (existsSync(fallbackEnvFile)) {
	process.loadEnvFile(fallbackEnvFile);
}

export default defineConfig((options) => ({
	entry: ["src/index.ts"],
	format: "esm",
	dts: true,
	sourcemap: false,
	treeshake: true,
	env: {
		REGISTRY_URL: process.env.REGISTRY_URL || "http://localhost:3000",
		HTTPS_PROXY: process.env.HTTPS_PROXY ?? ""
	},
	outDir: "dist",
	clean: true,
	minify: true,
	splitting: false,
	banner: {
		js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
	},
	...options
}));
