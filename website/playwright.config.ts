import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 30_000,
    use: {
        baseURL: "http://localhost:6006",
        headless: true
    },
    webServer: {
        command: "pnpm exec storybook dev -p 6006 --ci --no-open",
        url: "http://localhost:6006",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
    }
});
