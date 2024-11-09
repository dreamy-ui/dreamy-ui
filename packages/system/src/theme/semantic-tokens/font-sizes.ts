import { defineSemanticTokens } from "@pandacss/dev";

export const fontSizes = defineSemanticTokens.fontSizes({
	sm: {
		value: {
			DEFAULT: "xs",
			_md: "sm"
		}
	},
	md: {
		value: {
			DEFAULT: "sm",
			_md: "md"
		}
	},
	lg: {
		value: {
			DEFAULT: "md",
			_md: "lg"
		}
	},
	xl: {
		value: {
			DEFAULT: "lg",
			_md: "xl"
		}
	},
	"2xl": {
		value: {
			DEFAULT: "xl",
			_md: "2xl"
		}
	},
	"3xl": {
		value: {
			DEFAULT: "2xl",
			_md: "3xl"
		}
	},
	"4xl": {
		value: {
			DEFAULT: "3xl",
			_md: "4xl"
		}
	},
	"5xl": {
		value: {
			DEFAULT: "4xl",
			_md: "5xl"
		}
	},
	"6xl": {
		value: {
			DEFAULT: "5xl",
			_md: "6xl"
		}
	}
});
