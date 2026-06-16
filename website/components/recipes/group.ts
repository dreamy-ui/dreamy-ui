import { defineRecipe } from "@pandacss/dev";

export const group = defineRecipe({
    className: "group",
    jsx: ["Group"],
    base: {
        display: "inline-flex",
        isolation: "isolate",
        position: "relative",
        "& [data-group-item]": {
            _focusVisible: {
                zIndex: 1
            },
            _focus: {
                zIndex: 1
            },
            _hover: {
                zIndex: 1
            }
        }
    },
    variants: {
        orientation: {
            horizontal: {
                flexDirection: "row"
            },
            vertical: {
                flexDirection: "column"
            }
        },
        attached: {
            true: {
                gap: "0"
            },
            false: {
                gap: "0.5rem"
            }
        },
        grow: {
            true: {
                display: "flex",
                "& > *": {
                    flex: 1
                }
            }
        },
        stacking: {
            "first-on-top": {
                "& > [data-group-item]": {
                    zIndex: "calc(var(--group-count) - var(--group-index))"
                }
            },
            "last-on-top": {
                "& > [data-group-item]": {
                    zIndex: "var(--group-index)"
                }
            }
        }
    },
    compoundVariants: [
        {
            orientation: "horizontal",
            attached: true,
            css: {
                "& > *[data-first]": {
                    borderEndRadius: "0!"
                },
                "& > *[data-between]": {
                    borderRadius: "0!",
                    borderStartWidth: "0!"
                },
                "& > *[data-last]:not([data-first])": {
                    borderStartRadius: "0!",
                    borderStartWidth: "0!"
                }
            }
        },
        {
            orientation: "vertical",
            attached: true,
            css: {
                "& > *[data-first]": {
                    borderBottomRadius: "0!"
                },
                "& > *[data-between]": {
                    borderRadius: "0!",
                    borderBlockStartWidth: "0!"
                },
                "& > *[data-last]:not([data-first])": {
                    borderTopRadius: "0!",
                    borderBlockStartWidth: "0!"
                }
            }
        }
    ],
    defaultVariants: {
        orientation: "horizontal",
        attached: false
    }
});
