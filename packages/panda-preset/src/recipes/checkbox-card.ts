import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

const parts = defineParts({
    root: { selector: "&" },
    header: { selector: "& [data-part='header']" },
    title: { selector: "& [data-part='title']" },
    description: { selector: "& [data-part='description']" },
    checkboxRoot: {
        selector: "& [data-part='checkbox-root']"
    },
    control: {
        selector: '& [data-part="control"]'
    },
    icon: {
        selector: '& [data-part="icon"]'
    },
    label: {
        selector: '& [data-part="label"]'
    }
});

export { parts as checkboxCardParts };

export const checkboxCard = defineRecipe({
    className: "dreamy-checkbox-card",
    jsx: ["CheckboxCard"],
    base: parts({
        root: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            borderWidth: "1px",
            borderColor: "border.muted",
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
            }
        },
        header: {
            display: "flex",
            flexDir: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 6,
            pr: 10
        },
        title: {
            color: "fg",
            fontWeight: "semibold"
        },
        description: {
            color: "fg.medium"
        },
        checkboxRoot: {
            position: "absolute",
            top: 3,
            right: 3,
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
            flex: 1,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "l1",
            transition: "border-color 0.1s, background-color 0.1s"
        }
    }),
    defaultVariants: {
        size: "md",
        checkboxVariant: "solid",
        variant: "outline",
        scheme: "primary"
    },
    variants: {
        size: {
            sm: parts({
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
                control: {
                    width: "5",
                    height: "5"
                }
            }),
            md: parts({
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
                control: {
                    width: "5",
                    height: "5"
                }
            }),
            lg: parts({
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
                control: {
                    width: "6",
                    height: "6"
                }
            })
        },
        variant: {
            outline: parts({
                root: {
                    borderWidth: "1px",
                    borderColor: "border.muted",
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
            }),
            subtle: parts({
                root: {
                    borderWidth: "0px",
                    _checked: {
                        bg: "var(--checkbox-bg)/18"
                    },
                    _focusVisible: {
                        bg: "var(--checkbox-bg)/18"
                    }
                }
                // title: {
                //     ".group:is(:checked, [data-checked], [aria-checked=true])&": {
                //         color: "var(--checkbox-bg)"
                //     }
                // },
                // description: {
                //     ".group:is(:checked, [data-checked], [aria-checked=true])&": {
                //         color: "var(--checkbox-bg)"
                //     }
                // }
            })
        },
        checkboxVariant: {
            outline: parts({
                control: {
                    borderColor: "border.muted",
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
                    borderColor: "border.muted"
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
