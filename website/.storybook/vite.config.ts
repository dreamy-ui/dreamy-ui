import pandacss from "@pandacss/dev/postcss";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    process.env = { ...process.env, ...env };

    return {
        css: {
            postcss: {
                plugins: [pandacss({ configPath: "./panda.config.ts" })]
            }
        },
        plugins: [tsconfigPaths({ root: "./" })]
    };
});
