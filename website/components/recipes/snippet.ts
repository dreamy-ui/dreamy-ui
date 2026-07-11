import { defineSlotRecipe } from "@pandacss/dev";

export const snippet = defineSlotRecipe({
    className: "snippet",
    description:
        "A dark-themed code snippet block with header bar and copy button for displaying example code. Uses a near-black background with a separated header — only size changes padding and font size.",
    jsx: ["Snippet.Root", "Snippet.Header", "Snippet.Body"],
    slots: ["root", "header", "headerInner", "headerIcon", "headerContent", "copy", "body", "pre"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "l3",
            backgroundColor: "#1a1a1a",
            color: "fg.medium",
            overflow: "hidden"
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "whiteAlpha.300"
        },
        headerInner: {
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: 0,
            flex: 1
        },
        headerIcon: {
            boxSize: 4,
            color: "fg.medium",
            flexShrink: 0
        },
        headerContent: {
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: 0,
            flexWrap: "wrap"
        },
        copy: {
            flexShrink: 0,
            p: 2,
            color: "fg.medium",
            _hover: {
                color: "fg"
            },
        },
        body: {},
        pre: {
            m: 0,
            p: 0,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            color: "fg.medium"
        }
    },
    variants: {
        size: {
            sm: {
                body: {
                    px: 3,
                    py: 3,
                    fontSize: "sm"
                },
                header: {
                    px: 3,
                    py: 1.5
                }
            },
            md: {
                body: {
                    px: 4,
                    py: 4,
                    fontSize: "md"
                },
                header: {
                    px: 4,
                    py: 2
                }
            },
            lg: {
                body: {
                    px: 5,
                    py: 5,
                    fontSize: "lg"
                },
                header: {
                    px: 5,
                    py: 2.5
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
