import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { createDreamPreset } from "./src/theme/preset";

export default defineConfig({
    preflight: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    include: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [pandaPreset, createDreamPreset()],
    exclude: []
});
