import pandacss from "@pandacss/dev/postcss";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    process.env = { ...process.env, ...env };

    return {
        css: {
            postcss: {
                plugins: [pandacss({ configPath: "./panda.config.ts" })]
            }
        },
        resolve: {
            alias: {
                "@/ui": resolve(__dirname, "../components/ui/index")
            }
        },
        plugins: [tsconfigPaths({ root: "./" })]
    };
});
