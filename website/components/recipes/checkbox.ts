import { defineParts, getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

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
        selector: ".dreamy-checkbox-group:has(&)"
    }
});

export { parts as checkboxParts };

const schemeVariants = getColorSchemes(
    "--checkbox-bg",
    (scheme) => {
        return {
            color:
                scheme === "primary"
                    ? "{colors.primary.fg}"
                    : scheme === "secondary"
                      ? "{colors.secondary.fg}"
                      : scheme === "success" || scheme === "warning" || scheme === "info"
                        ? "black/87"
                        : scheme === "none"
                          ? "var(--colors-bg)"
                          : "white/87"
        };
    },
    "root"
);

export const checkbox = defineRecipe({
    className: "checkbox",
    description:
        "A checkbox control for boolean selection with label and group support. outline keeps a bordered box and tints the border to the scheme color when checked; solid fills the entire box with the scheme color when checked.",
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
            "&[data-disabled]": {
                cursor: "not-allowed",
                opacity: 0.6
            },
            "&:hover [data-part=control]": {
                bg: "alpha.50"
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
            borderWidth: "2px",
            borderStyle: "solid",
            borderRadius: "l1",
            transition: "border-color 0.1s, background-color 0.1s",
            _focusVisible: {
                bg: "{colors.border}",
                boxShadow: "0 0 0 1.5px {colors.primary}"
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
                    borderColor: "{colors.border}",
                    color: "var(--checkbox-bg)"
                },
                root: {
                    "& [data-part=control][data-checked], & [data-part=control][data-indeterminate]":
                        {
                            borderColor: "var(--checkbox-bg)"
                        },
                    "&:is(:active, [data-active]) [data-part=control]": {
                        borderColor: "var(--checkbox-bg)"
                    },
                    "&[data-invalid] [data-part=control]": {
                        borderColor: "error"
                    }
                }
            }),
            solid: parts({
                control: {
                    borderColor: "{colors.border}"
                },
                root: {
                    "& [data-part=control][data-checked], & [data-part=control][data-indeterminate]":
                        {
                            background: "var(--checkbox-bg)",
                            borderColor: "var(--checkbox-bg)"
                        },
                    "&:is(:active, [data-active]) [data-part=control]": {
                        background: "var(--checkbox-bg)/50",
                        borderColor: "var(--checkbox-bg)"
                    },
                    "&[data-invalid] [data-part=control]": {
                        borderColor: "error"
                    }
                }
            })
        },
        scheme: Object.fromEntries(
            Object.entries(schemeVariants).map(([name, slotStyles]) => [
                name,
                parts(slotStyles as Parameters<typeof parts>[0])
            ])
        )
    }
});
