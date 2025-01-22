import { createDreamyPreset } from "@dreamy-ui/system";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";

export default defineConfig({
	preflight: true,
	watch: true,
	jsxFramework: "react",
	jsxStyleProps: "all",
	outExtension: "js",
	include: [
		"./src/stories/**/*.{js,jsx,ts,tsx}",
		".storybook/**/*.{js,jsx,ts,tsx}"
	],
	importMap: "@dreamy-ui/system",
	exclude: [],
	presets: [pandaPreset, createDreamyPreset()]
});
