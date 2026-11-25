import { defineSlotRecipe } from "@pandacss/dev";

export const pagination = defineSlotRecipe({
    className: "pagination",
    description:
        "Page navigation controls with previous/next triggers and numbered page items. The active page shows a primary-filled pill indicator behind the number — only size affects dimensions.",
    slots: ["root", "item", "ellipsis", "firstTrigger", "prevTrigger", "nextTrigger", "lastTrigger"],
    jsx: [
        "Pagination.Root",
        "Pagination.Item",
        "Pagination.Ellipsis",
        "Pagination.FirstTrigger",
        "Pagination.PrevTrigger",
        "Pagination.NextTrigger",
        "Pagination.LastTrigger"
    ],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            "& [data-slot='pagination-list']": {
                display: "flex",
                alignItems: "center",
                gap: 1,
                listStyle: "none",
                margin: 0,
                padding: 0
            },
            "& [data-slot='pagination-item']": {
                display: "inline-flex",
                alignItems: "center"
            }
        },
        item: {
            transition: "none!",
            "&[data-current]": {
                color: "primary.fg"
            },
            "& [data-part='indicator']": {
                position: "absolute",
                inset: 0,
                bg: "primary",
                zIndex: -1,
                rounded: "l2"
            }
        },
        ellipsis: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "fg.medium"
        },
        firstTrigger: {
            "&[data-disabled]": {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        },
        prevTrigger: {
            "&[data-disabled]": {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        },
        nextTrigger: {
            "&[data-disabled]": {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        },
        lastTrigger: {
            "&[data-disabled]": {
                opacity: 0.4,
                cursor: "not-allowed"
            }
        }
    },
    variants: {
        size: {
            sm: {
                ellipsis: {
                    boxSize: "8"
                }
            },
            md: {
                ellipsis: {
                    boxSize: "9"
                }
            },
            lg: {
                ellipsis: {
                    boxSize: "10"
                }
            },
            xl: {
                ellipsis: {
                    boxSize: "11"
                }
            },
            "2xl": {
                ellipsis: {
                    boxSize: "12"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
