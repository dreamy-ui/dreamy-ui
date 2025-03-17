import { defineTokens } from "@pandacss/dev";

export function defineColorTokens() {
	return defineTokens.colors({
		current: { value: "currentColor" },
		blackAlpha: {
			50: { value: "rgba(0, 0, 0, 0.04)" },
			100: { value: "rgba(0, 0, 0, 0.08)" },
			200: { value: "rgba(0, 0, 0, 0.12)" },
			300: { value: "rgba(0, 0, 0, 0.16)" },
			400: { value: "rgba(0, 0, 0, 0.24)" },
			500: { value: "rgba(0, 0, 0, 0.32)" },
			600: { value: "rgba(0, 0, 0, 0.40)" },
			700: { value: "rgba(0, 0, 0, 0.48)" },
			800: { value: "rgba(0, 0, 0, 0.56)" },
			900: { value: "rgba(0, 0, 0, 0.64)" },
			950: { value: "rgba(0, 0, 0, 0.72)" }
		},
		whiteAlpha: {
			50: { value: "rgba(255, 255, 255, 0.04)" },
			100: { value: "rgba(255, 255, 255, 0.08)" },
			200: { value: "rgba(255, 255, 255, 0.12)" },
			300: { value: "rgba(255, 255, 255, 0.16)" },
			400: { value: "rgba(255, 255, 255, 0.24)" },
			500: { value: "rgba(255, 255, 255, 0.32)" },
			600: { value: "rgba(255, 255, 255, 0.40)" },
			700: { value: "rgba(255, 255, 255, 0.48)" },
			800: { value: "rgba(255, 255, 255, 0.56)" },
			900: { value: "rgba(255, 255, 255, 0.64)" },
			950: { value: "rgba(255, 255, 255, 0.72)" }
		},
		transparent: { value: "rgb(0 0 0 / 0)" },
		gray: {
			50: { value: "#fafafa" },
			100: { value: "#f4f4f5" },
			200: { value: "#e4e4e7" },
			300: { value: "#d4d4d8" },
			400: { value: "#a1a1aa" },
			500: { value: "#71717a" },
			600: { value: "#52525b" },
			700: { value: "#3f3f46" },
			800: { value: "#27272a" },
			900: { value: "#18181b" },
			950: { value: "#111111" }
		}
	});
}
