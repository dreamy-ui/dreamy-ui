import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import { patterns } from "./components/patterns";
import { recipes } from "./components/recipes";

export default defineConfig({
    preflight: true,
    watch: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin()],
    patterns,
    theme: {
        extend: {
            recipes
        }
    },
    globalCss: {
        extend: {}
    },
    staticCss: {
        extend: {}
    }
});
