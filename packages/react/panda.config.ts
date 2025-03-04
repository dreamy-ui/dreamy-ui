import createDreamyPreset from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";

export default defineConfig({
    preflight: true,
    watch: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    include: ["./src/**/*.{js,jsx,ts,tsx}", ".storybook/**/*.{js,jsx,ts,tsx}"],
    exclude: [],
    importMap: "styled-system",
    outdir: "styled-system",
    presets: [pandaPreset, createDreamyPreset()]
});
