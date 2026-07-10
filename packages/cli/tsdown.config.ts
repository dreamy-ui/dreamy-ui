import { defineConfig } from "tsdown";

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
