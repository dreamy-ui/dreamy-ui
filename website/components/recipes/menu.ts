import { defineSlotRecipe } from "@pandacss/dev";

export const menu = defineSlotRecipe({
    className: "menu",
    description:
        "A dropdown menu for action lists with items, separators, and keyboard navigation. plain pads the content and rounds each item; stretched removes inner padding so items span the full dropdown width edge to edge.",
    jsx: ["Menu.Root", "Menu.Trigger", "Menu.TriggerItem", "Menu.Content", "Menu.Item"],
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
            borderRadius: "l2!",
            outline: 0,
            maxH: "96",
            gap: "0 !important",
            overflowY: "auto",
            backgroundColor: "bg",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "{colors.border}",
            boxShadow: "md",
            width: "2xs !important",
            transformOrigin: "var(--transform-origin, center)"
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
            width: "full",
            outline: "none",
            "&[data-focused], &[data-highlighted]": {
                bg: "alpha.50"
            },
            "&[data-destructive]": {
                color: "error"
            },
            "&[data-disabled], &[aria-disabled='true']": {
                opacity: "0.5",
                cursor: "not-allowed"
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
                    "--menu-trigger-height": "sizes.7",
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
                }
            },
            sm: {
                root: {
                    "--menu-trigger-height": "sizes.8",
                    "--menu-trigger-padding-x": "spacing.2.5"
                },
                content: {
                    textStyle: "sm"
                },
                item: {
                    py: "1",
                    px: "1.5",
                    "& span": {
                        gap: "1.5"
                    }
                }
            },
            md: {
                root: {
                    "--menu-trigger-height": "sizes.9",
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
                }
            },
            lg: {
                root: {
                    "--menu-trigger-height": "sizes.10",
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
                }
            },
            xl: {
                root: {
                    "--menu-trigger-height": "sizes.11",
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
                }
            },
            "2xl": {
                root: {
                    "--menu-trigger-height": "sizes.12",
                    "--menu-trigger-padding-x": "spacing.5"
                },
                content: {
                    textStyle: "lg"
                },
                item: {
                    py: "2.5",
                    px: "3.5",
                    "& span": {
                        gap: "3"
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
