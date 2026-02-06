import { defineSlotRecipe } from "@pandacss/dev";

export const emptyState = defineSlotRecipe({
    className: "empty-state",
    description: "Dreamy UI Empty State component",
    slots: ["root", "content", "indicator", "title", "description"],
    jsx: [
        "EmptyState.Root",
        "EmptyState.Content",
        "EmptyState.Indicator",
        "EmptyState.Title",
        "EmptyState.Description"
    ],
    base: {
        root: {
            width: "full"
        },
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        },
        indicator: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "fg.disabled",
            "& :where(svg)": {
                boxSize: "1em"
            }
        },
        title: {
            fontWeight: "semibold",
            textAlign: "center"
        },
        description: {
            textStyle: "sm",
            color: "fg.medium",
            textAlign: "center"
        }
    },
    variants: {
        size: {
            sm: {
                root: {
                    px: 4,
                    py: 6
                },
                title: {
                    textStyle: "md"
                },
                content: {
                    gap: 4
                },
                indicator: {
                    textStyle: "2xl"
                }
            },
            md: {
                root: {
                    px: 8,
                    py: 12
                },
                title: {
                    textStyle: "lg"
                },
                content: {
                    gap: 6
                },
                indicator: {
                    textStyle: "4xl"
                }
            },
            lg: {
                root: {
                    px: 12,
                    py: 16
                },
                title: {
                    textStyle: "xl"
                },
                content: {
                    gap: 8
                },
                indicator: {
                    textStyle: "6xl"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
