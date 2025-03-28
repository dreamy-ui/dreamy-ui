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
			maxW: "100vw",
			"--popper-arrow-bg":
				"{colors.bg.panel}",
			"& [data-popper-arrow-inner]": {
				backdropFilter: "blur({blurs.base})"
			},
			display: "flex",
			flexDirection: "column",
			position: "relative",
			borderRadius: "l2",
			backgroundColor:
				"bg.panel",
			backdropFilter: "blur({blurs.base})",
			boxShadow: "sm",
			borderWidth: "1px",
			borderStyle: "solid",
			borderColor: "{colors.border}",
			gap: 2
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			p: "var(--popover-padding)",
		},
		body: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			gap: 2,
			px: "var(--popover-padding)",
		},
		footer: {
			display: "flex",
			justifyContent: "flex-end",
			alignItems: "center",
			width: "100%",
			gap: 2,
			p: "var(--popover-padding)",
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
					"--popover-padding": "spacing.3",
					width: "sm"
				}
			},
			md: {
				content: {
					"--popover-padding": "spacing.4",
					width: "md"
				}
			},
			lg: {
				content: {
					"--popover-padding": "spacing.5",
					width: "lg"
				}
			},
			xl: {
				content: {
					"--popover-padding": "spacing.6",
					width: "xl"
				}
			},
			"2xl": {
				content: {
					"--popover-padding": "spacing.7",
					width: "2xl"
				}
			},
			"3xl": {
				content: {
					"--popover-padding": "spacing.8",
					width: "3xl"
				}
			},
			"4xl": {
				content: {
					"--popover-padding": "spacing.9",
					width: "4xl"
				}
			},
			"5xl": {
				content: {
					"--popover-padding": "spacing.10",
					width: "5xl"
				}
			},
			"6xl": {
				content: {
					"--popover-padding": "spacing.10",
					width: "6xl"
				}
			},
			"7xl": {
				content: {
					"--popover-padding": "spacing.10",
					width: "7xl"
				}
			},
			"8xl": {
				content: {
					"--popover-padding": "spacing.10",
					width: "8xl"
				}
			}
		}
	},
	defaultVariants: {
		size: "md"
	}
});
