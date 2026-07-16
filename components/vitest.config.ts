import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        reporters: ["html", "json"],
        outputFile: {
            html: "./test-results.html",
            json: "./test-results.json"
        },
        include: ["**/*.test.{ts,tsx}"],
        exclude: ["**/node_modules/**"],
        typecheck: {
            enabled: true,
            ignoreSourceErrors: true,
            include: ["**/*.{test,test-d}.{ts,tsx}"],
            tsconfig: "./tsconfig.vitest.json"
        }
    },
    resolve: {
        tsconfigPaths: true
    }
});
