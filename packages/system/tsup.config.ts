import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    external: ["react", "@pandacss/preset-panda", "@pandacss/dev"],
    outDir: "dist",
    ...options
}));
