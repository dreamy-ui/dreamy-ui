import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entryPoints: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	// sourcemap: true,
	treeshake: true,
	external: [],
	outDir: "dist",
	// banner: {
	// 	js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
	// },
	...options
}));
