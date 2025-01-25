import { createDreamyPreset } from "@dreamy-ui/system";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";

export default defineConfig({
    preflight: true,
    include: ["./src/**/*.{js,jsx,ts,tsx}"],
    importMap: "@dreamy-ui/system",
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    presets: [
        pandaPreset,
        createDreamyPreset({
            rounded: "sm"
        })
    ],
    theme: {
        extend: {}
    }
});
