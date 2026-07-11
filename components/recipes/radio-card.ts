import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const radioCard = defineSlotRecipe({
    className: "radio-card",
    description:
        "A selectable card tile with an embedded radio for picking one option from a set. variant outline borders the card with a scheme ring when checked; subtle has no border and applies a soft scheme tint when selected; radioVariant solid fills the inner dot with the scheme color.",
    slots: ["root", "header", "title", "description", "radio", "label"],
    jsx: [
        "RadioCard.Root",
        "RadioCard.RootProvider",
        "RadioCard.Header",
        "RadioCard.Title",
        "RadioCard.Description",
        "RadioCard.Radio",
        "RadioCard.Label"
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
            "&:hover [data-part=wrapper]": {
                bg: "{colors.alpha.50}"
            },
            "&[data-checked] [data-part=wrapper]": {
                borderColor: "var(--radio-bg)"
            },
            "&[data-checked] [data-part=control]": {
                opacity: 1,
                scale: 1
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
        radio: {
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
            "& [data-part=wrapper]": {
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "{colors.border}",
                borderRadius: "full",
                transition: "border-color 0.1s, background-color 0.1s",
                _focusVisible: {
                    bg: "{colors.border}",
                    boxShadow: "0 0 0 1.5px {colors.primary}"
                }
            },
            "& [data-part=control]": {
                zIndex: 10,
                opacity: 0,
                scale: 0,
                transformOrigin: "center",
                borderRadius: "full",
                transition: "opacity 0.1s, scale 0.2s",
                transitionTimingFunction: "ease-in-out"
            }
        }
    },
    defaultVariants: {
        size: "md",
        radioVariant: "solid",
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
                radio: {
                    "& [data-part=wrapper]": {
                        width: "4",
                        height: "4"
                    },
                    "& [data-part=control]": {
                        width: "1.5",
                        height: "1.5"
                    }
                }
            },
            md: {
                root: {
                    padding: "4",
                    gap: "1.5"
                },
                title: {
                    textStyle: "md"
                },
                description: {
                    textStyle: "sm"
                },
                radio: {
                    "& [data-part=wrapper]": {
                        width: "5",
                        height: "5"
                    },
                    "& [data-part=control]": {
                        width: "2",
                        height: "2"
                    }
                }
            },
            lg: {
                root: {
                    padding: "5",
                    gap: "1.5"
                },
                title: {
                    textStyle: "lg"
                },
                description: {
                    textStyle: "md"
                },
                radio: {
                    "& [data-part=wrapper]": {
                        width: "6",
                        height: "6"
                    },
                    "& [data-part=control]": {
                        width: "2.5",
                        height: "2.5"
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
                        borderColor: "var(--radio-bg)",
                        boxShadow: "0 0 0 0.5px var(--radio-bg)",
                        _hover: {
                            borderColor: "var(--radio-bg)"
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
                        bg: "var(--radio-bg)/18"
                    },
                    _focusVisible: {
                        bg: "var(--radio-bg)/18"
                    }
                }
            }
        },
        radioVariant: {
            solid: {
                radio: {
                    "& [data-part=control]": {
                        background: "var(--radio-bg)"
                    }
                },
                root: {
                    "&[data-checked]:is(:active, [data-active]) [data-part=control]": {
                        opacity: 1
                    },
                    "&:is(:active, [data-active]) [data-part=control]": {
                        scale: 0.5,
                        opacity: 0.5,
                        background: "var(--radio-bg)"
                    },
                    "&[data-checked]:is(:active, [data-active]) [data-part=wrapper]": {
                        borderColor: "var(--radio-bg)"
                    },
                    "&:is(:active, [data-active]) [data-part=wrapper]": {
                        borderColor: "var(--radio-bg)/50"
                    }
                }
            }
        },
        scheme: getColorSchemes(
            "--radio-bg",
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
                } as Record<any, any>;
            },
            "root"
        )
    }
});
