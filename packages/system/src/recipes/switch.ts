import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

const parts = defineParts({
    root: {
        selector: "&"
    },
    control: {
        selector: '& [data-part="control"]'
    },
    thumb: {
        selector: '& [data-part="thumb"]'
    },
    label: {
        selector: '& [data-part="label"]'
    }
});

export { parts as switchParts };

export const switchRecipe = defineRecipe({
    className: "dream-switch",
    jsx: ["Switch"],
    base: parts({
        root: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "start",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            maxWidth: "fit-content",
            _disabled: {
                cursor: "not-allowed",
                opacity: 0.6
            }
        },
        control: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            mr: 2,
            flexShrink: 0,
            overflow: "hidden",
            bg: "alpha.100",
            borderRadius: "full",
            transition: "border-color 0.1s, background-color 0.1s",
            height: "var(--switch-height)",
            width: "var(--switch-width)",
            justifyContent: "flex-start",
            _focusVisible: {
                bg: "{colors.border.muted}",
                boxShadow: "0 0 0 1.5px {colors.primary}"
            },
            ".group:is(:hover)&": {
                bg: "alpha.150"
            },
            ".group:is([data-checked])&": {
                bg: "var(--switch-bg)",
                justifyContent: "flex-end"
            },
            ".group:is([data-invalid])&": {
                boxShadow: "0 0 0 1.5px {colors.error}"
            }
        },
        thumb: {
            ".group:is([data-active])&": {
                width: "calc(var(--switch-height) * 1.35)"
            },
            transition:
                "width {durations.fast} {easings.easeInOut}, background {durations.normal} {easings.easeInOut}",
            bg: "white",
            height: "var(--switch-height)",
            width: "var(--switch-height)",
            scale: 0.8,
            borderRadius: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black"
        },
        label: {
            position: "relative",
            color: "fg",
            userSelect: "none",
            fontWeight: "medium"
        }
    }),
    defaultVariants: {
        size: "md",
        scheme: "primary"
    },
    variants: {
        size: {
            sm: parts({
                root: {
                    "--switch-width": "sizes.12",
                    "--switch-height": "sizes.6"
                },
                label: {
                    fontSize: "sm"
                }
            }),
            md: parts({
                root: {
                    "--switch-width": "sizes.14",
                    "--switch-height": "sizes.7"
                },
                label: {
                    fontSize: "md"
                }
            }),
            lg: parts({
                root: {
                    "--switch-width": "sizes.16",
                    "--switch-height": "sizes.8"
                },
                label: {
                    fontSize: "lg"
                }
            })
        },
        scheme: getColorSchemes("--switch-bg", undefined, "root")
    }
});
