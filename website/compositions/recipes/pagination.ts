import { defineSlotRecipe } from "@pandacss/dev";

export const pagination = defineSlotRecipe({
    className: "pagination",
    description: "Dreamy UI Pagination component",
    slots: ["root", "item", "ellipsis", "prevTrigger", "nextTrigger"],
    jsx: [
        "Pagination.Root",
        "Pagination.Item",
        "Pagination.Ellipsis",
        "Pagination.PrevTrigger",
        "Pagination.NextTrigger"
    ],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            gap: 1
        },
        item: {
            transition: "none!",
            "&[data-selected]": {
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
        prevTrigger: {},
        nextTrigger: {}
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
                    boxSize: "10"
                }
            },
            lg: {
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
