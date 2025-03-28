import { defineSlotRecipe } from "@pandacss/dev";

export const menu = defineSlotRecipe({
	className: "dreamy-menu",
	jsx: ["Menu", "MenuTrigger", "MenuContent", "MenuItem"],
	slots: ["root", "content", "item", "control"],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1.5",
			width: "full"
		},
		content: {
			display: "flex",
			flexDirection: "column",
			zIndex: "dropdown",
			borderRadius: "l2",
			outline: 0,
			maxH: "96",
			gap: "0 !important",
			overflowY: "auto",
			boxShadow: "md",
			width: "2xs !important"
		},
		item: {
			position: "relative",
			menu: "none",
			display: "flex",
			alignItems: "center",
			gap: "2",
			fontWeight: "semibold",
			cursor: "pointer",
			justifyContent: "space-between",
			flex: "1",
			textAlign: "start",
			width: "full",
			"&[data-focused]": {
				bg: "alpha.50"
			},
			_disabled: {
				pointerEvents: "none",
				opacity: "0.5"
			},
			"& span": {
				display: "flex",
				alignItems: "center",
				gap: "2"
			}
		},
		control: {
			pos: "relative"
		}
	},
	variants: {
		variant: {
			plain: {
				content: {
					p: "1.5!"
				},
				item: {
					borderRadius: "l1"
				}
			},
			stretched: {
				content: {
					p: "0!",
					py: "1!"
				},
				item: {
					borderRadius: "0"
				}
			}
		},
		size: {
			xs: {
				root: {
					"--menu-trigger-height": "sizes.8",
					"--menu-trigger-padding-x": "spacing.2"
				},
				content: {
					textStyle: "xs"
				},
				item: {
					py: "1",
					px: "2",
					"& span": {
						gap: "1"
					}
				},
				itemIndicator: {
					right: "2"
				},
				indicator: {
					_icon: {
						width: "3.5",
						height: "3.5"
					}
				}
			},
			sm: {
				root: {
					"--menu-trigger-height": "sizes.9",
					"--menu-trigger-padding-x": "spacing.2.5"
				},
				content: {
					textStyle: "sm"
				},
				indicator: {
					_icon: {
						width: "4",
						height: "4"
					}
				},
				item: {
					py: "1",
					px: "1.5",
					"& span": {
						gap: "1.5"
					}
				},
				itemIndicator: {
					right: "1.5"
				}
			},
			md: {
				root: {
					"--menu-trigger-height": "sizes.10",
					"--menu-trigger-padding-x": "spacing.3"
				},
				content: {
					textStyle: "sm"
				},
				item: {
					py: "1.5",
					px: "2",
					"& span": {
						gap: "2"
					}
				},
				itemIndicator: {
					right: "2"
				},
				indicator: {
					_icon: {
						width: "4",
						height: "4"
					}
				}
			},
			lg: {
				root: {
					"--menu-trigger-height": "sizes.12",
					"--menu-trigger-padding-x": "spacing.4"
				},
				content: {
					textStyle: "md"
				},
				item: {
					py: "2",
					px: "3",
					"& span": {
						gap: "2.5"
					}
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
					_icon: {
						width: "5",
						height: "5"
					}
				}
			}
		}
	},
	defaultVariants: {
		size: "md",
		variant: "plain"
	}
});
