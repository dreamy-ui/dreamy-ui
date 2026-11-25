import { defineParts, getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: {
        selector: "&"
    },
    wrapper: {
        selector: '& [data-part="wrapper"]'
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
        selector: ".dreamy-radio-group:has(&)"
    }
});

export { parts as radioParts };

const schemeVariants = getColorSchemes("--radio-bg", undefined, "root");

export const radio = defineRecipe({
    className: "radio",
    description:
        "A radio button for single selection within a group with animated inner dot. solid fills the inner dot with the scheme color when checked and scales it down with reduced opacity on press.",
    jsx: ["Radio", "RadioGroup"],
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
            },
            "&[data-readonly]": {
                cursor: "default"
            },
            "&[data-readonly]:hover [data-part=wrapper]": {
                bg: "transparent"
            },
            "&[data-invalid] [data-part=wrapper]": {
                borderColor: "error"
            },
            "&:hover [data-part=wrapper]": {
                bg: "{colors.alpha.50}"
            },
            "& [data-part=wrapper][data-checked]": {
                borderColor: "var(--radio-bg)"
            },
            "& [data-part=control][data-checked]": {
                opacity: 1,
                scale: 1
            }
        },
        wrapper: {
            position: "relative",
            mr: 2,
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
        control: {
            zIndex: 10,
            opacity: 0,
            scale: 0,
            transformOrigin: "center",
            borderRadius: "full",
            transition: "opacity 0.1s, scale 0.2s",
            transitionTimingFunction: "ease-in-out"
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
                wrapper: {
                    width: "4",
                    height: "4"
                },
                control: {
                    width: "1.5",
                    height: "1.5"
                },
                label: {
                    fontSize: "sm"
                }
            }),
            md: parts({
                wrapper: {
                    width: "5",
                    height: "5"
                },
                control: {
                    width: "2",
                    height: "2"
                },
                label: {
                    fontSize: "md"
                }
            }),
            lg: parts({
                wrapper: {
                    width: "6",
                    height: "6"
                },
                control: {
                    width: "2.5",
                    height: "2.5"
                },
                label: {
                    fontSize: "lg"
                }
            })
        },
        variant: {
            solid: parts({
                root: {
                    "&:is(:active, [data-active]) [data-part=control]": {
                        scale: 0.5,
                        opacity: 0.5
                    },
                    "&:is(:active, [data-active]) [data-part=control][data-checked]": {
                        scale: 0.5,
                        opacity: 1
                    },
                    "&:is(:active, [data-active]) [data-part=wrapper]": {
                        borderColor: "var(--radio-bg)/50"
                    },
                    "&:is(:active, [data-active]) [data-part=wrapper][data-checked]": {
                        borderColor: "var(--radio-bg)"
                    }
                },
                control: {
                    background: "var(--radio-bg)"
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
