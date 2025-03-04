import { defineSlotRecipe } from "@pandacss/dev";

export const popover = defineSlotRecipe({
	className: "dreamy-popover",
	description: "Dreamy UI Popover component",
	slots: ["content", "body", "header", "footer", "close"],
	jsx: [
		"Popover",
		"PopoverContent",
		"PopoverBody",
		"PopoverHeader",
		"PopoverFooter",
		"PopoverCloseButton",
		// menu
		"Menu",
		"MenuTrigger",
		"MenuContent",
		"MenuItem"
	],
	base: {
		content: {
			"--popper-z-index": "{zIndex.popover}",
			"--popper-arrow-bg":
				"color-mix(in srgb, {colors.bg} 70%, {colors.alpha.100} 10%)",
			"& [data-popper-arrow-inner]": {
				backdropFilter: "blur({blurs.base})"
			},
			display: "flex",
			flexDirection: "column",
			position: "relative",
			borderRadius: "l2",
			backgroundColor:
				"color-mix(in srgb, {colors.bg} 70%, {colors.alpha.100} 10%)",
			backdropFilter: "blur({blurs.base})",
			boxShadow: "sm",
			borderWidth: "1px",
			borderStyle: "solid",
			borderColor: "{colors.border.muted}",
			gap: 2
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			px: 3,
			py: 2,
			borderBottomWidth: "1px",
			borderBottomStyle: "solid",
			borderBottomColor: "{colors.border.muted}"
		},
		body: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			gap: 2,
			px: 3,
			py: 2
		},
		footer: {
			display: "flex",
			justifyContent: "flex-end",
			alignItems: "center",
			width: "100%",
			gap: 2,
			px: 3,
			py: 2,
			borderTopWidth: "1px",
			borderTopStyle: "solid",
			borderTopColor: "{colors.border.muted}"
		},
		close: {
			position: "absolute",
			top: 1,
			insetInlineEnd: 2
		}
	},
	variants: {
		size: {
			sm: {
				content: {
					width: "sm"
				}
			},
			md: {
				content: {
					width: "md"
				}
			},
			lg: {
				content: {
					width: "lg"
				}
			},
			xl: {
				content: {
					width: "xl"
				}
			},
			"2xl": {
				content: {
					width: "2xl"
				}
			},
			"3xl": {
				content: {
					width: "3xl"
				}
			},
			"4xl": {
				content: {
					width: "4xl"
				}
			},
			"5xl": {
				content: {
					width: "5xl"
				}
			},
			"6xl": {
				content: {
					width: "6xl"
				}
			},
			"7xl": {
				content: {
					width: "7xl"
				}
			},
			"8xl": {
				content: {
					width: "8xl"
				}
			}
		}
	},
	defaultVariants: {
		size: "md"
	}
});
