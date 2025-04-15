import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    preflight: true,
    watch: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    clean: true,
    include: ["./src/**/*.{js,jsx,ts,tsx}", ".storybook/**/*.{js,jsx,ts,tsx}"],
    exclude: [],
    importMap: "styled-system",
    outdir: "styled-system",
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin]
});
