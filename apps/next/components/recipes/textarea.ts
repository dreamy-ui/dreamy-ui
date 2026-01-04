import { defineRecipe } from "@pandacss/dev";

export const textarea = defineRecipe({
    className: "textarea",
    jsx: ["Textarea", "TextareaNoAutoSize"],
    base: {
        appearance: "none",
        background: "none",
        borderColor: "border",
        borderRadius: "l2",
        borderWidth: "1px",
        colorPalette: "accent",
        minWidth: 0,
        p: 2,
        outline: 0,
        position: "relative",
        transitionDuration: "normal",
        transitionProperty: "box-shadow, border-color, background",
        transitionTimingFunction: "default",
        width: "fit-content",
        _disabled: {
            opacity: 0.4,
            cursor: "not-allowed"
        },
        _focus: {
            borderColor: "colorPalette.default",
            boxShadow: "0 0 0 1px var(--colors-color-palette-default)"
        }
    },
    defaultVariants: {
        size: "md",
        variant: "outline"
    },
    variants: {
        size: {
            sm: { p: "2.5", minW: "8", fontSize: "xs", minH: 8 },
            md: { p: "3", minW: "10", fontSize: "md", minH: 10 },
            lg: { p: "4", minW: "12", fontSize: "lg", minH: 12 }
        },
        variant: {
            outline: {
                borderWidth: "1px",
                background: "none",
                borderColor: "{colors.border}",
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
                "&:user-invalid, &[data-invalid]": {
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
                    background: "{colors.alpha.200}"
                },
                _focusWithin: {
                    boxShadow: "0 0 0 1.5px {colors.primary}"
                },
                "&:user-invalid, &[data-invalid]": {
                    _focusWithin: {
                        boxShadow: "0 0 0 1.5px {colors.error} !important"
                    },
                    boxShadow: "0 0 0 1px {colors.error} !important"
                }
            },
            flushed: {
                borderWidth: 0,
                borderRadius: 0,
                borderBottomWidth: "1px",
                borderBottomColor: "{colors.border}",
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
                "&:user-invalid, &[data-invalid]": {
                    borderBottomColor: "{colors.error}  !important",
                    _focusWithin: {
                        boxShadow: "0 0.5px 0 0 {colors.error}  !important"
                    },
                    _hover: {
                        borderBottomColor: "{colors.error}"
                    }
                }
            }
        }
    }
});
