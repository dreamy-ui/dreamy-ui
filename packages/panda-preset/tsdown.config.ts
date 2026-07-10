import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    format: "esm",
    dts: {
        oxc: true,
        compilerOptions: {
            isolatedDeclarations: true
        }
    },
    deps: {
        neverBundle: ["@pandacss/dev", "@pandacss/types"]
    },
    sourcemap: true,
    minify: true,
    clean: true,
    splitting: false,
    outDir: "dist",
    ...options
}));
