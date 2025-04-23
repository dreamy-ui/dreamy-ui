import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entryPoints: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	sourcemap: true,
	external: [],
	outDir: "dist",
	...options
}));
