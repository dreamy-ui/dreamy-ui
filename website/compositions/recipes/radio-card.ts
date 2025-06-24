import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: { selector: "&" },
	header: { selector: "& [data-part='header']" },
	title: { selector: "& [data-part='title']" },
	description: { selector: "& [data-part='description']" },
	radioRoot: {
		selector: "& [data-part='radio-root']"
	},
	wrapper: {
		selector: '& [data-part="wrapper"]'
	},
	control: {
		selector: '& [data-part="control"]'
	},
	label: {
		selector: '& [data-part="label"]'
	}
});

export { parts as radioCardParts };

export const radioCard = defineRecipe({
	className: "dreamy-radio-card",
	jsx: ["RadioCard"],
	base: parts({
		root: {
			position: "relative",
			display: "flex",
			flexDirection: "column",
			justifyContent: "start",
			cursor: "pointer",
			WebkitTapHighlightColor: "transparent",
			borderWidth: "1px",
			borderColor: "border",
			borderStyle: "solid",
			borderRadius: "l2",
			width: "auto",
			flex: 1,
			_disabled: {
				cursor: "not-allowed",
				opacity: 0.6
			},
			_hover: {
				borderColor: "border.hover"
			}
		},
		header: {
			display: "flex",
			flexDir: "row",
			alignItems: "flex-start",
			w: "full",
			justifyContent: "space-between",
			gap: 6,
			// pr: 10,
			".group:is([data-center])&": {
				alignItems: "center"
			}
		},
		title: {
			color: "fg",
			fontWeight: "semibold",
			w: "full"
		},
		description: {
			color: "fg.medium"
		},
		radioRoot: {
			position: "relative",
			// top: 3,
			// right: 3,
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
		}
	}),
	defaultVariants: {
		size: "md",
		radioVariant: "solid",
		variant: "outline",
		scheme: "primary"
	},
	variants: {
		size: {
			sm: parts({
				root: {
					padding: "3",
					gap: "0.5"
				},
				title: {
					textStyle: "sm"
				},
				description: {
					textStyle: "xs"
				},
				wrapper: {
					width: "4",
					height: "4"
				},
				control: {
					width: "1.5",
					height: "1.5"
				}
			}),
			md: parts({
				root: {
					padding: "4",
					gap: "1.5"
				},
				title: {
					textStyle: "md"
				},
				description: {
					textStyle: "sm"
				},
				wrapper: {
					width: "5",
					height: "5"
				},
				control: {
					width: "2",
					height: "2"
				}
			}),
			lg: parts({
				root: {
					padding: "5",
					gap: "1.5"
				},
				title: {
					textStyle: "lg"
				},
				description: {
					textStyle: "md"
				},
				wrapper: {
					width: "6",
					height: "6"
				},
				control: {
					width: "2.5",
					height: "2.5"
				}
			})
		},
		variant: {
			outline: parts({
				root: {
					borderWidth: "1px",
					borderColor: "border",
					transition: "border-color 0.1s",
					_hover: {
						borderColor: "border.hover"
					},
					_checked: {
						borderColor: "var(--radio-bg)",
						boxShadow: "0 0 0 0.5px var(--radio-bg)",
						_hover: {
							borderColor: "var(--radio-bg)"
						}
					},
					_focusVisible: {
						borderColor: "border.hover",
						boxShadow: "0 0 0 1.5px {colors.primary}"
					}
				}
			}),
			subtle: parts({
				root: {
					borderWidth: "0px",
					_checked: {
						bg: "var(--radio-bg)/18"
					},
					_focusVisible: {
						bg: "var(--radio-bg)/18"
					}
				}
			})
		},
		radioVariant: {
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
		scheme: getColorSchemes(
			"--radio-bg",
			(scheme) => {
				return {
					color:
						scheme === "primary"
							? "{colors.primary.fg}"
							: scheme === "secondary"
							? "{colors.secondary.fg}"
							: scheme === "success" ||
							  scheme === "warning" ||
							  scheme === "info"
							? "black/87"
							: "white/87"
				} as Record<any, any>;
			},
			"root"
		)
	}
});
