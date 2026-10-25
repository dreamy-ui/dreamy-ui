import { createDreamyPresets, dreamyPlugin, splitThemeRecipes } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import { patterns } from "./components/patterns";
import { recipes as recipeDefinitions } from "./components/recipes";

const { recipes, slotRecipes } = splitThemeRecipes(recipeDefinitions);

export default defineConfig({
    preflight: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "./app/**/*.{js,jsx,ts,tsx}"
    ],
    presets: createDreamyPresets(),
    plugins: [dreamyPlugin()],
    patterns,
    theme: {
        extend: {
            recipes,
            slotRecipes
        }
    },
    globalCss: {
        extend: {}
    },
    staticCss: {
        extend: {}
    }
});
