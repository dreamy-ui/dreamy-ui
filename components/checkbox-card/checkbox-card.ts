import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const checkboxCard = defineSlotRecipe({
    className: "checkbox-card",
    description:
        "A selectable card tile that combines a checkbox with title and description for option pickers. variant outline styles the card with a border that gains a scheme ring when checked; subtle has no border and applies a soft scheme tint when checked; checkboxVariant controls the inner checkbox as outline (border-only) or solid (filled when checked).",
    slots: ["root", "header", "title", "description", "checkbox", "label"],
    jsx: [
        "CheckboxCard.Root",
        "CheckboxCard.RootProvider",
        "CheckboxCard.Header",
        "CheckboxCard.Title",
        "CheckboxCard.Description",
        "CheckboxCard.Checkbox",
        "CheckboxCard.Label"
    ],
    base: {
        root: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            borderWidth: "1px",
            borderColor: "border",
            borderStyle: "solid",
            borderRadius: "l2",
            width: "auto",
            flex: 1,
            _disabled: {
                cursor: "not-allowed",
                opacity: 0.6
            },
            _hover: {
                borderColor: "border.hover"
            },
            "&:hover [data-part=control]": {
                bg: "{colors.alpha.50}"
            },
            "&:not(:has([data-slot=description])) [data-slot=header]": {
                alignItems: "center"
            }
        },
        header: {
            display: "flex",
            flexDir: "row",
            alignItems: "flex-start",
            w: "full",
            justifyContent: "space-between",
            gap: 6
        },
        title: {
            color: "fg",
            fontWeight: "semibold",
            w: "full"
        },
        description: {
            color: "fg.medium"
        },
        checkbox: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "start",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            maxWidth: "fit-content",
            flexShrink: 0,
            _disabled: {
                cursor: "not-allowed",
                opacity: 0.6
            },
            "& [data-part=control]": {
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "l1",
                transition: "border-color 0.1s, background-color 0.1s",
                _focusVisible: {
                    bg: "{colors.border}",
                    boxShadow: "0 0 0 1.5px {colors.primary}"
                }
            },
            "& [data-part=icon]": {
                color: "currentColor"
            }
        }
    },
    defaultVariants: {
        size: "md",
        checkboxVariant: "solid",
        variant: "outline",
        scheme: "primary"
    },
    variants: {
        size: {
            sm: {
                root: {
                    padding: "3",
                    gap: "0.5"
                },
                title: {
                    textStyle: "sm"
                },
                description: {
                    textStyle: "xs"
                },
                checkbox: {
                    "& [data-part=control]": {
                        width: "5",
                        height: "5"
                    }
                }
            },
            md: {
                root: {
                    padding: "3",
                    gap: "1.5"
                },
                title: {
                    textStyle: "md"
                },
                description: {
                    textStyle: "sm"
                },
                checkbox: {
                    "& [data-part=control]": {
                        width: "5",
                        height: "5"
                    }
                }
            },
            lg: {
                root: {
                    padding: "4",
                    gap: "1.5"
                },
                title: {
                    textStyle: "lg"
                },
                description: {
                    textStyle: "md"
                },
                checkbox: {
                    "& [data-part=control]": {
                        width: "6",
                        height: "6"
                    }
                }
            }
        },
        variant: {
            outline: {
                root: {
                    borderWidth: "1px",
                    borderColor: "border",
                    transition: "border-color 0.1s",
                    _hover: {
                        borderColor: "border.hover"
                    },
                    _checked: {
                        borderColor: "var(--checkbox-bg)",
                        boxShadow: "0 0 0 0.5px var(--checkbox-bg)",
                        _hover: {
                            borderColor: "var(--checkbox-bg)"
                        }
                    },
                    _focusVisible: {
                        borderColor: "border.hover",
                        boxShadow: "0 0 0 1.5px {colors.primary}"
                    }
                }
            },
            subtle: {
                root: {
                    borderWidth: "0px",
                    _checked: {
                        bg: "var(--checkbox-bg)/18"
                    },
                    _focusVisible: {
                        bg: "var(--checkbox-bg)/18"
                    }
                }
            }
        },
        checkboxVariant: {
            outline: {
                checkbox: {
                    "& [data-part=control]": {
                        borderColor: "border",
                        color: "var(--checkbox-bg)"
                    }
                },
                root: {
                    "&[data-checked] [data-part=control]": {
                        borderColor: "var(--checkbox-bg)"
                    },
                    "&:is(:active, [data-active]) [data-part=control]": {
                        borderColor: "var(--checkbox-bg)"
                    }
                }
            },
            solid: {
                checkbox: {
                    "& [data-part=control]": {
                        borderColor: "border"
                    }
                },
                root: {
                    "&[data-checked] [data-part=control]": {
                        background: "var(--checkbox-bg)",
                        borderColor: "var(--checkbox-bg)"
                    },
                    "&:is(:active, [data-active]) [data-part=control]": {
                        background: "var(--checkbox-bg)/50",
                        borderColor: "var(--checkbox-bg)"
                    }
                }
            }
        },
        scheme: getColorSchemes(
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
                                : "white/87"
                };
            },
            "root"
        )
    }
});
