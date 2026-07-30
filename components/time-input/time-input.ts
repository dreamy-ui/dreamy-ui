import { mapJsx } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const timeInput = defineSlotRecipe({
    className: "time-input",
    description:
        "A time picker with configurable fields (hour, minute, second, millisecond, and optional AM/PM) and an infinite scroll wheel popover. Trigger variants match Input (outline, solid, filledOutline). Size scales the trigger height, segment text, and wheel row height.",
    jsx: mapJsx("TimeInput", [
        "Root",
        "Trigger",
        "Content",
        "Columns",
        "Column",
        "Segment",
        "Separator",
        "Indicator",
        "AIO"
    ]),
    slots: [
        "root",
        "trigger",
        "segment",
        "separator",
        "indicator",
        "content",
        "columns",
        "column",
        "columnLabel",
        "wheelWrap",
        "wheel",
        "wheelItem",
        "wheelSpacer",
        "wheelHighlight"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "1.5",
            position: "relative",
            width: "fit-content"
        },
        trigger: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            h: "var(--time-input-height)",
            minH: "var(--time-input-height)",
            px: "var(--time-input-padding-x)",
            borderRadius: "l2",
            cursor: "text",
            userSelect: "none",
            outline: "none",
            transitionProperty: "background, border-color, box-shadow",
            transitionDuration: "normal",
            transitionTimingFunction: "ease-in-out",
            _disabled: {
                cursor: "not-allowed",
                opacity: 0.4
            },
            "&[data-placeholder]": {
                color: "fg.medium"
            }
        },
        segment: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minW: "var(--time-input-segment-min-w)",
            px: "0.5",
            borderRadius: "l1",
            fontVariantNumeric: "tabular-nums",
            // fontWeight: "medium",
            lineHeight: "1",
            outline: "none",
            cursor: "text",
            transitionProperty: "background, color",
            transitionDuration: "fast",
            _focusVisible: {
                background: "primary/15",
                color: "fg"
            },
            "&[data-focused]": {
                background: "primary/15",
                color: "fg"
            },
            "&[data-placeholder]": {
                color: "fg.medium"
            }
        },
        separator: {
            color: "fg.medium",
            userSelect: "none",
            flexShrink: 0,
            lineHeight: "1",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
        },
        indicator: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: "auto",
            pl: "2",
            color: "fg.medium",
            flexShrink: 0,
            pointerEvents: "none",
            "& svg": {
                width: "var(--time-input-icon-size)",
                height: "var(--time-input-icon-size)"
            }
        },
        content: {
            zIndex: "popover",
            width: "fit-content!",
            minW: "0!",
            maxW: "fit-content!",
            height: "fit-content!",
            p: "2",
            gap: "0!"
        },
        columns: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1",
            px: "2",
            py: "2",
            position: "relative",
            w: "fit-content",
            h: "fit-content",
            isolation: "isolate"
        },
        column: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5",
            minW: "12",
            w: "12",
            position: "relative",
            flexShrink: 0,
            zIndex: 1
        },
        columnLabel: {
            fontSize: "2xs",
            // fontWeight: "medium",
            color: "fg.medium",
            textTransform: "uppercase",
            letterSpacing: "wider",
            lineHeight: "1",
            h: "3",
            display: "flex",
            alignItems: "center"
        },
        wheelWrap: {
            position: "relative",
            width: "full",
            overflow: "hidden",
            flexShrink: 0
        },
        wheel: {
            position: "relative",
            width: "full",
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
            scrollbarWidth: "none",
            cursor: "grab",
            WebkitOverflowScrolling: "touch",
            userSelect: "none",
            maskImage:
                "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            _active: {
                cursor: "grabbing"
            },
            "&::-webkit-scrollbar": {
                display: "none"
            }
        },
        wheelItem: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            fontVariantNumeric: "tabular-nums",
            fontSize: "sm",
            lineHeight: "1",
            color: "fg.medium",
            cursor: "grab",
            userSelect: "none",
            pointerEvents: "none",
            width: "full",
            flexShrink: 0,
            background: "transparent",
            borderWidth: 0,
            boxSizing: "border-box",
            transitionProperty: "color",
            transitionDuration: "fast",
            "&[data-selected]": {
                color: "fg",
                fontWeight: "semibold"
            }
        },
        wheelSpacer: {
            flexShrink: 0,
            width: "full",
            pointerEvents: "none"
        },
        wheelHighlight: {
            position: "absolute",
            left: "0",
            right: "0",
            borderRadius: "l2",
            background: "alpha.50",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border",
            pointerEvents: "none",
            zIndex: 0
        }
    },
    variants: {
        variant: {
            outline: {
                trigger: {
                    bg: "transparent",
                    borderWidth: "1px",
                    borderColor: "border",
                    _hover: {
                        borderColor: "border.hover",
                        _invalid: {
                            borderColor: "error"
                        }
                    },
                    _expanded: {
                        borderColor: "border.hover",
                        _invalid: {
                            borderColor: "error"
                        }
                    },
                    "&[data-open]": {
                        borderColor: "primary",
                        boxShadow: "0 0 0 0.5px {colors.primary}",
                        _invalid: {
                            borderColor: "error",
                            boxShadow: "0 0 0 0.5px {colors.error}"
                        }
                    },
                    _invalid: {
                        borderColor: "error"
                    }
                }
            },
            solid: {
                trigger: {
                    borderWidth: "0px",
                    borderColor: "transparent",
                    bg: "alpha.50",
                    _hover: {
                        bg: "alpha.100"
                    },
                    "&[data-open]": {
                        bg: "alpha.100",
                        boxShadow: "0 0 0 1.5px {colors.primary}",
                        _invalid: {
                            boxShadow: "0 0 0 1.5px {colors.error}"
                        }
                    },
                    _invalid: {
                        boxShadow: "0 0 0 1.5px {colors.error}"
                    }
                }
            },
            filledOutline: {
                trigger: {
                    bg: "alpha.50",
                    borderWidth: "2px",
                    borderColor: "border",
                    _hover: {
                        borderColor: "border.hover",
                        bg: "alpha.100",
                        _invalid: {
                            borderColor: "error"
                        }
                    },
                    "&[data-open]": {
                        borderColor: "primary",
                        bg: "alpha.100",
                        boxShadow: "0 0 0 0.5px {colors.primary}",
                        _invalid: {
                            borderColor: "error",
                            boxShadow: "0 0 0 0.5px {colors.error}"
                        }
                    },
                    _invalid: {
                        borderColor: "error"
                    }
                }
            }
        },
        size: {
            sm: {
                root: {
                    "--time-input-height": "{sizes.8}",
                    "--time-input-padding-x": "{spacing.2}",
                    "--time-input-segment-min-w": "{sizes.5}",
                    "--time-input-icon-size": "{sizes.3.5}"
                },
                trigger: {
                    textStyle: "sm"
                },
                content: {
                    textStyle: "sm"
                },
                column: {
                    minW: "10",
                    w: "10"
                },
                columns: {
                    px: "1.5",
                    py: "1.5"
                }
            },
            md: {
                root: {
                    "--time-input-height": "{sizes.9}",
                    "--time-input-padding-x": "{spacing.3}",
                    "--time-input-segment-min-w": "{sizes.6}",
                    "--time-input-icon-size": "{sizes.4}"
                },
                trigger: {
                    textStyle: "md"
                },
                content: {
                    textStyle: "sm"
                }
            },
            lg: {
                root: {
                    "--time-input-height": "{sizes.10}",
                    "--time-input-padding-x": "{spacing.4}",
                    "--time-input-segment-min-w": "{sizes.7}",
                    "--time-input-icon-size": "{sizes.5}"
                },
                trigger: {
                    textStyle: "lg"
                },
                content: {
                    textStyle: "md"
                },
                column: {
                    minW: "14",
                    w: "14"
                },
                columns: {
                    px: "2.5",
                    py: "2.5"
                }
            }
        }
    },
    defaultVariants: {
        size: "md",
        variant: "outline"
    }
});
