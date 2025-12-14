import { defineSemanticTokens } from "@pandacss/dev";

export const shadows = defineSemanticTokens.shadows({
	xs: {
		value: {
			base: "0px 1px 2px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 1px 1px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	sm: {
		value: {
			base: "0px 2px 4px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 2px 4px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	md: {
		value: {
			base: "0px 4px 8px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 4px 8px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	lg: {
		value: {
			base: "0px 8px 16px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 8px 16px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	xl: {
		value: {
			base: "0px 16px 24px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 16px 24px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	"2xl": {
		value: {
			base: "0px 24px 40px {colors.blackAlpha.100}, 0px 0px 1px {colors.blackAlpha.100}",
			_dark: "0px 24px 40px {colors.blackAlpha.100}, 0px 0px 1px inset {colors.blackAlpha.100}"
		}
	},
	"inset-2xs": { value: "inset 0 1px {colors.blackAlpha.100}" },
	"inset-xs": { value: "inset 0 1px 1px {colors.blackAlpha.100}" },
	"inset-sm": { value: "inset 0 2px 4px {colors.blackAlpha.100}" }
});
