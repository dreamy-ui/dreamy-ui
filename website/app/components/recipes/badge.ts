import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

export const badge = defineRecipe({
	className: "dreamy-badge",
	jsx: ["Badge"],
	base: {
		display: "inline-block",
		whiteSpace: "nowrap",
		verticalAlign: "middle",
		px: 1,
		textTransform: "uppercase",
		fontSize: "xs",
		borderRadius: "sm",
		fontWeight: "bold",
		width: "fit-content"
	},
	defaultVariants: {
		variant: "subtle",
		scheme: "primary"
	},
	variants: {
		variant: {
			outline: {
				border: "1px solid",
				borderColor: "var(--badge-color)",
				color: "var(--badge-color)",
				bg: "transparent"
			},
			subtle: {
				color: "var(--badge-color)",
				bg: "var(--badge-color)/10"
			}
		},
		scheme: getColorSchemes("--badge-color")
	}
});
