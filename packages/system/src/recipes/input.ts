import { defineRecipe } from "@pandacss/dev";

export const input = defineRecipe({
    className: "dream-input",
    jsx: ["Input", "PinInput", "PinInputField", "InputGroup", "InputLeftAddon", "InputRightAddon"],
    staticCss: ["*"],
    base: {
        appearance: "none",
        borderRadius: "l2",
        borderWidth: 0,
        colorPalette: "accent",
        color: "fg",
        background: "transparent",
        position: "relative",
        transitionDuration: "normal",
        transitionTimingFunction: "default",
        transitionProperty: "box-shadow, border-color, background",
        width: "fit-content",
        _disabled: {
            opacity: 0.4,
            cursor: "not-allowed"
        },
        "[data-pin-input]:has(&)": {
            display: "flex",
            alignItems: "center",
            gap: 2
        }
    },
    defaultVariants: {
        size: "md",
        variant: "outline"
    },
    variants: {
        size: {
            sm: { px: "2", h: "8", minW: "8", fontSize: "xs" },
            md: { px: "3", h: "10", minW: "10", fontSize: "md" },
            lg: { px: "4", h: "12", minW: "12", fontSize: "lg" }
        },
        variant: {
            outline: {
                borderWidth: "1px",
                background: "none",
                borderColor: "{colors.border.muted}",
                _hover: {
                    borderColor: "{colors.border.hover}"
                },
                _focusWithin: {
                    boxShadow: "0 0 0 0.5px {colors.primary}",
                    borderColor: "{colors.primary}",
                    _hover: {
                        boxShadow: "0 0 0 0.5px {colors.primary}",
                        borderColor: "{colors.primary}"
                    }
                },
                _invalid: {
                    _focusWithin: {
                        boxShadow: "0 0 0 0.5px {colors.error} !important"
                    },
                    borderColor: "{colors.error} !important",
                    _hover: {
                        boxShadow: "0 0 0 0.5px {colors.error}",
                        borderColor: "{colors.error}"
                    }
                }
            },
            filled: {
                background: "{colors.alpha.100}",
                borderColor: "transparent",
                borderWidth: "0",
                _hover: {
                    background: "{colors.alpha.150}"
                },
                _focusWithin: {
                    boxShadow: "0 0 0 1.5px {colors.primary}"
                },
                _invalid: {
                    _focusWithin: {
                        boxShadow: "0 0 0 1.5px {colors.error} !important"
                    },
                    boxShadow: "0 0 0 1px {colors.error} !important"
                }
            },
            flushed: {
                borderRadius: 0,
                borderBottomWidth: "1px",
                borderBottomColor: "{colors.border.muted}",
                _hover: {
                    borderBottomColor: "{colors.border.hover}"
                },
                _focusVisible: {
                    borderBottomColor: "{colors.primary}",
                    boxShadow: "0 0.5px 0 0 {colors.primary}",
                    outline: "none",
                    _hover: {
                        borderBottomColor: "{colors.primary}"
                    }
                },
                _invalid: {
                    borderBottomColor: "{colors.error}  !important",
                    _focusWithin: {
                        boxShadow: "0 0.5px 0 0 {colors.error}  !important"
                    },
                    _hover: {
                        borderBottomColor: "{colors.error}"
                    }
                }
            }
        },
        inputType: {
            pin: {
                width: "fit-content",
                minWidth: "0",
                aspectRatio: "1/1",
                textAlign: "center"
            },
            default: {}
        }
    },
    compoundVariants: [
        {
            size: "sm",
            inputType: "pin",
            css: {
                fontSize: "xs"
            }
        },
        {
            size: "md",
            inputType: "pin",
            css: {
                fontSize: "sm"
            }
        },
        {
            size: "lg",
            inputType: "pin",
            css: {
                fontSize: "md"
            }
        }
    ]
});
