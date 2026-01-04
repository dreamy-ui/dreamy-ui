import { defineSlotRecipe } from "@pandacss/dev";

export const accordion = defineSlotRecipe({
    className: "accordion",
    description: "Dreamy UI Accordion component",
    slots: ["root", "item", "trigger", "content", "icon"],
    jsx: [
        "Accordion.Root",
        "Accordion.Item",
        "Accordion.Trigger",
        "Accordion.Content",
        "Accordion.Icon"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            width: "100%"
        },
        item: {
            display: "flex",
            flexDirection: "column",
            width: "100%"
        },
        trigger: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontFamily: "body",
            width: "100%",
            paddingY: "var(--accordion-padding-y)",
            fontSize: "md",
            fontWeight: "bold",
            textAlign: "left"
        },
        content: {
            textAlign: "left",
            color: "fg.medium",
            paddingBottom: "calc(var(--accordion-padding-y) * 2)"
        },
        icon: {
            width: 4,
            height: 4,
            transition: "transform 0.2s {easings.default}",
            color: "fg.medium",
            "[data-expanded] &": {
                transform: "rotate(180deg)"
            }
        }
    },
    variants: {
        size: {
            sm: {
                root: {
                    "--accordion-padding-y": "{spacing.1.5}"
                }
            },
            md: {
                root: {
                    "--accordion-padding-y": "{spacing.2}"
                }
            },
            lg: {
                root: {
                    "--accordion-padding-y": "{spacing.3}"
                }
            }
        },
        variant: {
            outline: {
                item: {
                    borderBottom: "1px solid",
                    borderColor: "{colors.border}"
                }
            },
            solid: {
                item: {
                    borderBottom: "1px solid",
                    borderColor: "{colors.border}",
                    _last: {
                        borderBottom: "none"
                    }
                },
                root: {
                    backgroundColor: "{colors.alpha.50}",
                    paddingX: "{spacing.3}",
                    paddingY: "{spacing.1}",
                    borderRadius: "l2"
                }
            },
            subtle: {
                root: {
                    gap: "{spacing.0.5}"
                },
                item: {
                    borderRadius: "l1",
                    transition: "background-color 0.2s {easings.default}",
                    _expanded: {
                        bg: "{colors.alpha.50}"
                    }
                },
                trigger: {
                    paddingX: "var(--accordion-padding-y)"
                },
                content: {
                    paddingX: "var(--accordion-padding-y)"
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        variant: "outline"
    }
});
