import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
    entry: {
        index: "src/index.ts",
        rsc: "src/rsc.ts"
    },
    format: "esm",
    dts: true,
    sourcemap: !options.watch,
    minify: !options.watch,
    clean: !options.watch,
    splitting: false,
    outDir: "dist",
    ...options
}));
