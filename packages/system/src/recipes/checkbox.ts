import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

const parts = defineParts({
    root: {
        selector: "&"
    },
    control: {
        selector: '& [data-part="control"]'
    },
    icon: {
        selector: '& [data-part="icon"]'
    },
    label: {
        selector: '& [data-part="label"]'
    },
    group: {
        selector: ".dream-checkbox-group:has(&)"
    }
});

export { parts as checkboxParts };

export const checkbox = defineRecipe({
    className: "dream-checkbox",
    jsx: ["Checkbox", "CheckboxGroup"],
    base: parts({
        group: {
            flexDirection: "column",
            gap: 0.5
        },
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
            justifyContent: "center",
            mr: 2,
            flexShrink: 0,
            overflow: "hidden",
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "l1",
            transition: "border-color 0.1s, background-color 0.1s",
            _focusVisible: {
                bg: "{colors.border.muted}",
                boxShadow: "0 0 0 1.5px {colors.primary}"
            },
            ".group:is(:hover)&": {
                bg: "alpha.50"
            }
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
        scheme: "primary",
        variant: "solid"
    },
    variants: {
        size: {
            sm: parts({
                control: {
                    width: "4",
                    height: "4"
                },
                label: {
                    fontSize: "sm"
                }
            }),
            md: parts({
                control: {
                    width: "5",
                    height: "5"
                },
                label: {
                    fontSize: "md"
                }
            }),
            lg: parts({
                control: {
                    width: "6",
                    height: "6"
                },
                label: {
                    fontSize: "lg"
                }
            })
        },
        variant: {
            outline: parts({
                control: {
                    borderColor: "{colors.border.default}",
                    ".group:is([data-checked])&": {
                        borderColor: "var(--checkbox-bg)"
                    },
                    ".group:is(:active)&": {
                        borderColor: "var(--checkbox-bg)"
                    },
                    color: "var(--checkbox-bg)"
                }
            }),
            solid: parts({
                control: {
                    ".group:is([data-checked])&": {
                        background: "var(--checkbox-bg)",
                        borderColor: "var(--checkbox-bg)"
                    },
                    ".group:is(:active)&": {
                        background: "var(--checkbox-bg)/50",
                        borderColor: "var(--checkbox-bg)"
                    },
                    borderColor: "{colors.border.default}"
                }
            })
        },
        scheme: getColorSchemes(
            "--checkbox-bg",
            (scheme) => {
                return {
                    color:
                        scheme === "success" || scheme === "warning" || scheme === "info"
                            ? "black/87"
                            : "white/87"
                } as Record<any, any>;
            },
            "root"
        )
    }
});
