import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

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
    className: "dreamy-snippet",
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
                    bg: "var(--snippet-color)/10",
                    color: "var(--snippet-color)"
                }
            }),
            bordered: parts({
                root: {
                    borderWidth: "2px",
                    borderColor: "var(--snippet-color)/32",
                    color: "var(--snippet-color)"
                }
            })
        },
        scheme: getColorSchemes("--snippet-color", undefined, "root"),
        size: {
            sm: parts({
                root: {
                    px: 1.5,
                    py: 0.5,
                    rounded: "l1"
                }
            }),
            md: parts({
                root: {
                    px: 2,
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
        scheme: "none",
        size: "md"
    }
});
