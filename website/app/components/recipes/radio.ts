import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: {
		selector: "&"
	},
	wrapper: {
		selector: '& [data-part="wrapper"]'
	},
	control: {
		selector: '& [data-part="control"]'
	},
	icon: {
		selector: '& [data-part="icon"]'
	},
	label: {
		selector: '& [data-part="label"]'
	},
	group: {
		selector: ".dreamy-radio-group:has(&)"
	}
});

export { parts as radioParts };

export const radio = defineRecipe({
	className: "dreamy-radio",
	jsx: ["Radio", "RadioGroup"],
	base: parts({
		group: {
			flexDirection: "column",
			gap: 0.5
		},
		root: {
			position: "relative",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "start",
			cursor: "pointer",
			WebkitTapHighlightColor: "transparent",
			maxWidth: "fit-content",
			_disabled: {
				cursor: "not-allowed",
				opacity: 0.6
			}
		},
		wrapper: {
			position: "relative",
			mr: 2,
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
			overflow: "hidden",
			borderWidth: "2px",
			borderStyle: "solid",
			borderColor: "{colors.border}",
			borderRadius: "full",
			transition: "border-color 0.1s, background-color 0.1s",
			_focusVisible: {
				bg: "{colors.border}",
				boxShadow: "0 0 0 1.5px {colors.primary}"
			},
			".group:is(:hover)&": {
				bg: "{colors.alpha.50}"
			},
			".group:is([data-checked])&": {
				borderColor: "var(--radio-bg)"
			}
		},
		control: {
			zIndex: 10,
			opacity: 0,
			scale: 0,
			transformOrigin: "center",
			borderRadius: "full",
			transition: "opacity 0.1s, scale 0.2s",
			transitionTimingFunction: "ease-in-out",
			".group:is([data-checked])&": {
				opacity: 1,
				scale: 1
			}
		},
		label: {
			position: "relative",
			color: "fg",
			userSelect: "none",
			fontWeight: "medium"
		}
	}),
	defaultVariants: {
		size: "md",
		scheme: "primary",
		variant: "solid"
	},
	variants: {
		size: {
			sm: parts({
				wrapper: {
					width: "4",
					height: "4"
				},
				control: {
					width: "1.5",
					height: "1.5"
				},
				label: {
					fontSize: "sm"
				}
			}),
			md: parts({
				wrapper: {
					width: "5",
					height: "5"
				},
				control: {
					width: "2",
					height: "2"
				},
				label: {
					fontSize: "md"
				}
			}),
			lg: parts({
				wrapper: {
					width: "6",
					height: "6"
				},
				control: {
					width: "2.5",
					height: "2.5"
				},
				label: {
					fontSize: "lg"
				}
			})
		},
		variant: {
			solid: parts({
				control: {
					background: "var(--radio-bg)",
					".group:is([data-checked])&": {
						".group:is(:active, [data-active])&": {
							opacity: 1
						}
					},
					".group:is(:active, [data-active])&": {
						scale: 0.5,
						opacity: 0.5,
						background: "var(--radio-bg)"
					}
				},
				wrapper: {
					".group:is([data-checked])&": {
						".group:is(:active, [data-active])&": {
							borderColor: "var(--radio-bg)"
						}
					},
					".group:is(:active, [data-active])&": {
						borderColor: "var(--radio-bg)/50"
					}
				}
			})
		},
		scheme: getColorSchemes("--radio-bg", undefined, "root")
	}
});
