import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const select = defineSlotRecipe({
	className: "dreamy-select",
	jsx: ["Select", "SelectInput", "SelectContent", "SelectOption"],
	slots: [
		"root",
		"trigger",
		"indicatorGroup",
		"indicator",
		"clearButton",
		"content",
		"item",
		"itemIndicator",
		"control"
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1.5",
			width: "auto",
			position: "relative"
		},
		trigger: {
			position: "relative",
			display: "flex",
			alignItems: "center",
			cursor: "pointer",
			justifyContent: "start",
			gap: 4,
			width: "full",
			minH: "var(--select-trigger-height)",
			px: "var(--select-trigger-padding-x)",
			borderRadius: "l2",
			userSelect: "none",
			textAlign: "start",
			focusVisibleRing: "inside",
			_placeholderShown: {
				color: "fg.medium"
			},
			_disabled: {
				cursor: "not-allowed",
				opacity: 0.5
			}
		},
		indicatorGroup: {
			display: "flex",
			alignItems: "center",
			gap: "1",
			pos: "absolute",
			right: "0",
			top: "0",
			bottom: "0",
			px: "var(--select-trigger-padding-x)",
			pointerEvents: "none"
		},
		indicator: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: {
				base: "fg.medium",
				_disabled: "fg.disabled",
				_invalid: "error"
			},
			transition: "transform {durations.normal} {easings.easeInOut}",
			transform: "rotate(0deg)",
			".group[data-open] &": {
				transform: "rotate(180deg)"
			}
		},
		clearButton: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "fg.medium",
			cursor: "pointer",
			isolation: "isolate",
			pointerEvents: "auto",
			transition: "color {durations.normal} {easings.easeInOut}",
			_hover: {
				color: "fg"
			},
			_disabled: {
				color: "fg.disabled"
			}
		},
		content: {
			display: "flex",
			flexDirection: "column",
			zIndex: "dropdown",
			borderRadius: "l2!",
			outline: 0,
			maxH: "96",
			p: "0 !important",
			gap: "0 !important",
			overflowY: "auto",
			boxShadow: "md"
		},
		item: {
			position: "relative",
			userSelect: "none",
			display: "flex",
			alignItems: "center",
			gap: "2",
			cursor: "pointer",
			justifyContent: "space-between",
			flex: "1",
			textAlign: "start",
			borderRadius: "0",
			width: "full",
			"&[data-focused]": {
				bg: "alpha.50"
			},
			".group[data-selected-strategy='both'] &[data-selected], .group[data-selected-strategy='background'] &[data-selected]":
				{
					bg: "var(--selected-item-background)",
					color: "var(--selected-item-color)"
				},
			_disabled: {
				pointerEvents: "none",
				opacity: "0.5"
			}
			// "& svg": {
			//     width: "4",
			//     height: "4"
			// }
		},
		itemIndicator: {
			position: "absolute"
		},
		control: {
			pos: "relative"
		}
	},
	variants: {
		variant: {
			outline: {
				trigger: {
					bg: "transparent",
					borderWidth: "1px",
					borderColor: "border",
					transition:
						"border-color {durations.normal} {easings.easeInOut}",
					_hover: {
						borderColor: "border.hover",
						_invalid: {
							borderColor: "error"
						}
					},
					_expanded: {
						borderColor: "border.hover",
						_invalid: {
							borderColor: "error"
						}
					},
					_focusVisible: {
						_invalid: {
							boxShadow: "0 0 0 0.5px {colors.error}"
						}
					},
					_invalid: {
						borderColor: "error"
					}
				}
			},
			solid: {
				trigger: {
					borderWidth: "0px",
					borderColor: "transparent",
					bg: "alpha.50",
					transition: "background 0.2s {easings.easeInOut}",
					_hover: {
						bg: "alpha.100"
					},
					_expanded: {
						bg: "alpha.100"
					},
					_invalid: {
						boxShadow: "0 0 0 1.5px {colors.error}"
					}
				}
			}
		},
		size: {
			xs: {
				root: {
					"--select-trigger-height": "{sizes.8}",
					"--select-trigger-padding-x": "{spacing.2}"
				},
				content: {
					textStyle: "xs"
				},
				trigger: {
					textStyle: "xs",
					gap: "1"
				},
				item: {
					py: "1",
					px: "2"
				},
				itemIndicator: {
					right: "2"
				},
				indicator: {
					width: "3.5",
					height: "3.5"
				},
				clearButton: {
					p: 1.5,
					"& svg": {
						width: "3.5",
						height: "3.5"
					}
				}
			},
			sm: {
				root: {
					"--select-trigger-height": "{sizes.9}",
					"--select-trigger-padding-x": "{spacing.2.5}"
				},
				content: {
					textStyle: "sm"
				},
				trigger: {
					textStyle: "sm",
					gap: "1"
				},
				indicator: {
					width: "4",
					height: "4"
				},
				item: {
					py: "1",
					px: "1.5"
				},
				itemIndicator: {
					right: "1.5"
				},
				clearButton: {
					p: 1.5,
					"& svg": {
						width: "3.5",
						height: "3.5"
					}
				}
			},
			md: {
				root: {
					"--select-trigger-height": "{sizes.10}",
					"--select-trigger-padding-x": "{spacing.3}"
				},
				content: {
					textStyle: "sm"
				},
				item: {
					py: "1.5",
					px: "2"
				},
				itemIndicator: {
					right: "2"
				},
				trigger: {
					textStyle: "sm",
					gap: "2"
				},
				indicator: {
					width: "4",
					height: "4"
				},
				clearButton: {
					p: 2,
					"& svg": {
						width: "4",
						height: "4"
					}
				}
			},
			lg: {
				root: {
					"--select-trigger-height": "{sizes.12}",
					"--select-trigger-padding-x": "{spacing.4}"
				},
				content: {
					textStyle: "md"
				},
				item: {
					py: "2",
					px: "3"
				},
				trigger: {
					textStyle: "md",
					py: "3",
					gap: "2"
				},
				itemIndicator: {
					right: "3"
				},
				indicator: {
					width: "5",
					height: "5"
				},
				clearButton: {
					p: 2.5,
					"& svg": {
						width: "5",
						height: "5"
					}
				}
			}
		},
		selectedItemBackgroundScheme: getColorSchemes(
			"--selected-item-background",
			(scheme) => {
				return {
					"--selected-item-color":
						scheme === "primary"
							? "{colors.primary.fg}"
							: scheme === "secondary"
							? "{colors.secondary.fg}"
							: scheme === "success" ||
							  scheme === "warning" ||
							  scheme === "info"
							? "color-mix(in srgb, black 87%, transparent)"
							: scheme === "none"
							? "colors.bg"
							: "color-mix(in srgb, white 87%, transparent)"
				} as Record<any, any>;
			},
			"root"
		)
	},
	defaultVariants: {
		size: "md",
		variant: "outline",
		selectedItemBackgroundScheme: "primary"
	}
});
