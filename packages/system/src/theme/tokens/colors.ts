import { defineTokens } from "@pandacss/dev";

export function defineColorTokens() {
	return defineTokens.colors({
		current: { value: "currentColor" },
		blackAlpha: {
			50: { value: "rgba(0, 0, 0, 0.04)" },
			100: { value: "rgba(0, 0, 0, 0.08)" },
			150: { value: "rgba(0, 0, 0, 0.12)" },
			200: { value: "rgba(0, 0, 0, 0.16)" },
			300: { value: "rgba(0, 0, 0, 0.24)" },
			400: { value: "rgba(0, 0, 0, 0.32)" },
			500: { value: "rgba(0, 0, 0, 0.40)" },
			600: { value: "rgba(0, 0, 0, 0.48)" },
			700: { value: "rgba(0, 0, 0, 0.56)" },
			800: { value: "rgba(0, 0, 0, 0.64)" },
			900: { value: "rgba(0, 0, 0, 0.72)" },
		},
		whiteAlpha: {
			50: { value: "rgba(255, 255, 255, 0.04)" },
			100: { value: "rgba(255, 255, 255, 0.08)" },
			150: { value: "rgba(255, 255, 255, 0.12)" },
			200: { value: "rgba(255, 255, 255, 0.16)" },
			300: { value: "rgba(255, 255, 255, 0.24)" },
			400: { value: "rgba(255, 255, 255, 0.32)" },
			500: { value: "rgba(255, 255, 255, 0.40)" },
			600: { value: "rgba(255, 255, 255, 0.48)" },
			700: { value: "rgba(255, 255, 255, 0.56)" },
			800: { value: "rgba(255, 255, 255, 0.64)" },
			900: { value: "rgba(255, 255, 255, 0.72)" },
		},
		transparent: { value: "rgb(0 0 0 / 0)" },
	});
}
