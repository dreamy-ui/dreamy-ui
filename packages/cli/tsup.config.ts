import { defineConfig } from "tsup";

try {
	process.loadEnvFile();
} catch (_error) {
	console.error("No .env file found");
}

export default defineConfig((options) => ({
	entryPoints: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: false,
	treeshake: true,
	env: {
		REGISTRY_URL: process.env.REGISTRY_URL || "http://localhost:3000",
		HTTPS_PROXY: process.env.HTTPS_PROXY || null
	},
	external: ["node:*", "path", "fs", "fs/promises", "os", "url", "util"],
	outDir: "dist",
	banner: {
		js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
	},
	...options
}));
