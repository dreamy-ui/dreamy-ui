import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    content: { selector: "& [data-part=content]" },
    pre: { selector: "& [data-part=pre]" },
    symbol: { selector: "& [data-part=symbol]" },
    copy: { selector: "& [data-part=copy]" },
    copyIcon: { selector: "& [data-part=copy-icon]" },
    checkIcon: { selector: "& [data-part=check-icon]" }
});

export { parts as snippetParts };

export const snippet = defineRecipe({
    className: "snippet",
    jsx: ["Snippet"],
    base: parts({
        root: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            h: "fit",
            gap: 2
        },
        content: {
            display: "flex",
            flexDirection: "column"
        },
        copy: {
            // bg: "transparent !important"
        },
        pre: {
            p: 0,
            overflowX: "auto"
        },
        symbol: {
            userSelect: "none"
        }
    }),
    variants: {
        variant: {
            solid: parts({
                root: {
                    bg: "alpha.50",
                    borderColor: "border",
                    borderWidth: "2px"
                }
            }),
            bordered: parts({
                root: {
                    borderWidth: "2px",
                    borderColor: "border"
                }
            })
        },
        size: {
            sm: parts({
                root: {
                    px: 2,
                    py: 0.5,
                    rounded: "l1"
                }
            }),
            md: parts({
                root: {
                    px: 3,
                    py: 1.5,
                    rounded: "l2"
                }
            }),
            lg: parts({
                root: {
                    px: 4,
                    py: 2,
                    rounded: "l2"
                }
            })
        }
    },
    defaultVariants: {
        variant: "solid",
        size: "md"
    }
});
