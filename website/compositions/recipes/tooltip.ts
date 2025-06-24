import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: {
		selector: "&"
	},
	arrowOuter: {
		selector: "& [data-popper-arrow]"
	},
	arrowInner: {
		selector: "& [data-popper-arrow-inner]"
	}
});

export { parts as tooltipParts };

export const tooltip = defineRecipe({
	className: "dreamy-tooltip",
	jsx: ["Tooltip"],
	base: parts({
		root: {
			"--tooltip-bg": "{colors.fg.max}",
			"--tooltip-color": "{colors.bg}",
			"--popper-arrow-bg": "var(--tooltip-bg)",
			bg: "var(--tooltip-bg)",
			color: "var(--tooltip-color)",
			px: 2,
			py: 0.5,
			fontSize: "sm",
			rounded: "l1",
			boxShadow: "md",
			maxW: "xs",
			zIndex: "{zIndex.tooltip}"
		}
	})
});
