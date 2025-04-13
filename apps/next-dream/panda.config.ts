import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    preflight: true,
    include: ["./src/**/*.{js,jsx,ts,tsx}"],
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    importMap: "styled-system",
    presets: [
        createDreamyPreset({
            rounded: "sm"
        })
    ],
    theme: {
        extend: {}
    },
    plugins: [dreamyPlugin]
});
