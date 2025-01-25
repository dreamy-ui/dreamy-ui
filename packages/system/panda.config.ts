import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { createDreamyPreset } from "./src/theme/preset";

export default defineConfig({
	preflight: true,
	jsxFramework: "react",
	jsxStyleProps: "all",
	outExtension: "js",
	include: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [pandaPreset, createDreamyPreset()],
	exclude: []
});
