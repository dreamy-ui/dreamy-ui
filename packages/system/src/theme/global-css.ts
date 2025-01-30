import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
	"*": {
		boxSizing: "border-box",
		outlineColor: "{colors.primary}"
	},
	"*:focus-visible": {
		outline: "none",
		boxShadow: "0 0 0 1.5px {colors.primary}",
		borderColor: "{colors.primary}"
	},
	html: {
		lineHeight: 1.5,
		fontFeatureSettings: '"cv11"',
		MozOsxFontSmoothing: "grayscale",
		textRendering: "optimizeLegibility",
		WebkitFontSmoothing: "antialiased",
		WebkitTextSizeAdjust: "100%",
		fontSmoothing: "always"
	},
	body: {
		fontFamily: "body",
		background: "bg",
		color: "fg",
		minHeight: "100dvh",
		height: "100%",
		colorScheme: "light",
		display: "flex",
		flexDirection: "column",
		_dark: {
			colorScheme: "dark"
		}
	},
	"*::selection": {
		bg: "primary/10",
		color: "primary"
	}
});
