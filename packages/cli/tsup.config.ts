import { defineConfig } from "tsup";

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

try {
    process.loadEnvFile(envFile);
} catch (_error) {
    try {
        process.loadEnvFile(".env");
    } catch (_error) {}
}

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: false,
    treeshake: true,
    env: {
        REGISTRY_URL: process.env.REGISTRY_URL || "http://localhost:3000",
        HTTPS_PROXY: process.env.HTTPS_PROXY ?? ""
    },
    external: ["node:*", "path", "fs", "fs/promises", "os", "url", "util"],
    outDir: "dist",
    banner: {
        js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
    },
    ...options
}));
