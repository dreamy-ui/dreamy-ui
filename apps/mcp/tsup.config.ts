import { defineConfig } from "tsup";

const env = {
    DREAMY_UI_BASE_URL: process.env.DREAMY_UI_BASE_URL ?? "http://localhost:3000"
} as const;

export default defineConfig([
    // STDIO build
    {
        entry: { stdio: "src/stdio.ts" },
        format: "esm",
        outDir: "dist",
        treeshake: "safest",
        splitting: false,
        env
    },
    // HTTP build
    {
        entry: { index: "src/http.ts" },
        format: "esm",
        outDir: "api",
        treeshake: "safest",
        splitting: false,
        env
    }
]);
