import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: { selector: "&" },
	leftIcon: { selector: '& > [data-part="icon-left"]' },
	rightIcon: { selector: '& [data-part="icon-right"]' },
	ripple: { selector: '& [data-part="ripple"]' },
	rippleContainer: { selector: '& > [data-part="ripple-container"]' },
	icons: {
		selector: '& [data-part="icon-left"], & [data-part="icon-right"]'
	}
});
export { parts as buttonParts };

export const button = defineRecipe({
	className: "dreamy-button",
	staticCss: ["*"],
	jsx: [
		"Button",
		"ModalCloseButton",
		"PopoverCloseButton",
		"CloseButton",
		"IconButton",
		"ModalCloseButtonBase",
		"ButtonIcon"
	],
	base: parts({
		root: {
			position: "relative",
			display: "inline-flex",
			alignItems: "center",
			fontWeight: "semibold",
			cursor: "pointer",
			borderRadius: "l2",
			isolation: "isolate",
			textAlign: "center",
			userSelect: "none",
			transition:
				"background-color 0.2s {easings.ease-in-out}, color 0.2s {easings.ease-in-out}, border-color 0.2s {easings.ease-in-out}, fill 0.2s {easings.ease-in-out}, transform 0.15s {easings.ease-in-out}",
			justifyContent: "center",
			_disabled: {
				cursor: "not-allowed",
				opacity: 0.5
			},
			"&[data-type='icon-button']": {
				px: "0 !important",
				py: "0 !important",
				aspectRatio: 1
			}
		},
		icons: {
			display: "inline-flex",
			alignSelf: "center",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0
		},
		rippleContainer: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			overflow: "hidden",
			pointerEvents: "none",
			borderRadius: "inherit"
		}
	}),
	defaultVariants: {
		variant: "solid",
		size: "md"
	},
	variants: {
		variant: {
			primary: parts({
				root: {
					bg: "primary",
					color: "{colors.primaryButtonText}",
					_hover: {
						bg: "color-mix(in srgb, {colors.primary}, currentColor 10%)"
					}
				}
			}),
			secondary: parts({
				root: {
					bg: "secondary",
					color: "{colors.secondaryButtonText}",
					_hover: {
						bg: "color-mix(in srgb, {colors.secondary}, currentColor 10%)"
					}
				}
			}),
			solid: parts({
				root: {
					bg: "currentColor/08",
					_hover: {
						bg: "currentColor/12"
					}
				}
			}),
			outline: parts({
				root: {
					bg: "transparent",
					borderWidth: 1,
					borderStyle: "solid",
					borderColor: "currentColor/16",
					_hover: {
						bg: "currentColor/08"
					}
				}
			}),
			ghost: parts({
				root: {
					bg: "transparent",
					_hover: {
						bg: "currentColor/12"
					}
				}
			}),
			link: parts({
				root: {
					bg: "transparent",
					h: "fit-content",
					px: 0,
					py: 0,
					rounded: "none",
					_hover: {
						bg: "transparent",
						color: "fg.max"
					}
				},
				ripple: {
					display: "none"
				},
				rippleContainer: {
					display: "none"
				}
			})
		},
		// scheme: getColorSchemes("--button-color", undefined, "root"),
		size: {
			xs: parts({
				root: {
					fontSize: "xs",
					h: 6,
					px: 2,
					py: 1,
					"--icon-button-icon-size": "16px"
				}
			}),
			sm: parts({
				root: {
					fontSize: "sm",
					h: 8,
					px: 3,
					py: 1,
					"--icon-button-icon-size": "20px"
				},
				leftIcon: {
					marginRight: 1.5
				},
				rightIcon: {
					marginLeft: 1.5
				}
			}),
			md: parts({
				root: {
					fontSize: "md",
					h: 10,
					px: 4,
					py: 2,
					"--icon-button-icon-size": "24px"
				},
				leftIcon: {
					marginRight: 2
				},
				rightIcon: {
					marginLeft: 2
				}
			}),
			lg: parts({
				root: {
					fontSize: "lg",
					h: 12,
					px: 5,
					py: 3,
					"--icon-button-icon-size": "28px"
				},
				leftIcon: {
					marginRight: 3
				},
				rightIcon: {
					marginLeft: 3
				}
			})
		}
	}
});
