import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    leftIcon: { selector: '& > [data-part="icon-left"]' },
    rightIcon: { selector: '& [data-part="icon-right"]' },
    ripple: { selector: '& [data-part="ripple"]' },
    rippleContainer: { selector: '& > [data-part="ripple-container"]' },
    icons: {
        selector: '& [data-part="icon-left"], & [data-part="icon-right"]'
    }
});

export { parts as buttonParts };

export const button = defineRecipe({
    className: "button",
    staticCss: ["*"],
    jsx: [
        "Button",
        "ModalCloseButton",
        "PopoverCloseButton",
        "CloseButton",
        "IconButton",
        "ModalCloseButtonBase",
        "ButtonIcon"
    ],
    base: parts({
        root: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            fontWeight: "semibold",
            cursor: "pointer",
            borderRadius: "l2",
            isolation: "isolate",
            textAlign: "center",
            userSelect: "none",
            transition:
                "background-color {durations.normal} {easings.ease-in-out}, color {durations.normal} {easings.ease-in-out}, border-color {durations.normal} {easings.ease-in-out}, fill {durations.normal} {easings.ease-in-out}",
            justifyContent: "center",
            _disabled: {
                cursor: "not-allowed",
                opacity: 0.5
            },
            "&[data-type='icon-button']": {
                px: "0 !important",
                py: "0 !important",
                aspectRatio: 1
            }
        },
        icons: {
            display: "flex",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
        },
        rippleContainer: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
            borderRadius: "inherit"
        }
    }),
    defaultVariants: {
        variant: "solid",
        size: "md"
    },
    variants: {
        variant: {
            primary: parts({
                root: {
                    bg: "primary",
                    color: "{colors.primaryButtonText}",
                    _hover: {
                        bg: "{colors.primary.hover}"
                    }
                }
            }),
            secondary: parts({
                root: {
                    bg: "secondary",
                    outlineColor: "{colors.secondary}",
                    color: "{colors.secondaryButtonText}",
                    _hover: {
                        bg: "{colors.secondary.hover}"
                    }
                }
            }),
            solid: parts({
                root: {
                    bg: "currentColor/06",
                    outlineColor: "currentColor",
                    _hover: {
                        bg: "currentColor/10"
                    }
                }
            }),
            outline: parts({
                root: {
                    bg: "transparent",
                    borderWidth: 1,
                    borderStyle: "solid",
                    outlineColor: "currentColor",
                    borderColor: "border",
                    _hover: {
                        bg: "currentColor/08",
                        borderColor: "border.hover"
                    }
                }
            }),
            ghost: parts({
                root: {
                    bg: "transparent",
                    outlineColor: "currentColor",
                    _hover: {
                        bg: "currentColor/08"
                    }
                }
            }),
            link: parts({
                root: {
                    bg: "transparent",
                    h: "fit-content",
                    outlineColor: "currentColor",
                    px: 0,
                    py: 0,
                    rounded: "none",
                    _hover: {
                        bg: "transparent",
                        color: "fg.max"
                    }
                },
                ripple: {
                    display: "none"
                },
                rippleContainer: {
                    display: "none"
                }
            })
        },
        size: {
            xs: parts({
                root: {
                    fontSize: "xs",
                    h: 6,
                    px: 2,
                    gap: 1,
                    "--icon-button-icon-size": "16px"
                }
            }),
            sm: parts({
                root: {
                    fontSize: "sm",
                    h: 8,
                    px: 3,
                    gap: 1.5,
                    "--icon-button-icon-size": "20px"
                }
            }),
            md: parts({
                root: {
                    fontSize: "md",
                    h: 10,
                    px: 4,
                    gap: 2,
                    "--icon-button-icon-size": "24px"
                }
            }),
            lg: parts({
                root: {
                    fontSize: "lg",
                    h: 12,
                    px: 5,
                    gap: 3,
                    "--icon-button-icon-size": "28px"
                }
            })
        },
        scheme: getColorSchemes("--button-scheme", undefined, "root")
    },
    compoundVariants: [
        {
            variant: ["outline"],
            scheme: ["error", "warning", "info", "success", "primary", "secondary"],
            css: {
                color: "var(--button-scheme)",
                borderColor: "var(--button-scheme)/16",
                _hover: {
                    bg: "var(--button-scheme)/08",
                    borderColor: "var(--button-scheme)/16"
                }
            }
        },
        {
            variant: ["ghost", "solid"],
            scheme: ["error", "warning", "info", "success", "primary", "secondary"],
            css: {
                color: "var(--button-scheme)"
            }
        }
    ]
});
