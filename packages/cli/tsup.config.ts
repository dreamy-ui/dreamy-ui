import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    external: ["node:*", "path", "fs", "fs/promises", "os", "url", "util"],
    outDir: "dist",
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
    },
    ...options
}));
