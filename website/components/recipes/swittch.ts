import { defineParts, getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: {
        selector: "&"
    },
    control: {
        selector: '& [data-part="control"]'
    },
    thumb: {
        selector: '& [data-part="thumb"]'
    },
    label: {
        selector: '& [data-part="label"]'
    }
});

export { parts as switchParts };

const schemeVariants = getColorSchemes(
    "--switch-bg",
    (scheme) =>
        scheme === "primary"
            ? {
                  _checked: {
                      _dark: {
                          "--switch-thumb-bg": "{colors.primary.fg}"
                      }
                  }
              }
            : scheme === "secondary"
              ? {
                    _checked: {
                        _dark: {
                            "--switch-thumb-bg": "{colors.secondary.fg}"
                        }
                    }
                }
              : scheme === "none"
                ? {
                      _checked: {
                          _dark: {
                              "--switch-thumb-bg": "black"
                          }
                      }
                  }
                : {},
    "root"
);

export const swittch = defineRecipe({
    className: "switch",
    description:
        "A toggle switch for on/off boolean settings with a sliding thumb. Unchecked track is soft gray; checked track fills with the scheme color and the white thumb slides right, stretching wider on press.",
    jsx: ["Switch"],
    base: parts({
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
            "&:hover [data-part=control]:not([data-checked]):not([data-disabled])": {
                bg: "alpha.200"
            },
            "&:is(:active, [data-active]) [data-part=thumb]:not([data-disabled]):not([data-readonly])":
                {
                    width: "var(--switch-thumb-active-size)"
                },
            "&:is(:active, [data-active]) [data-part=thumb][data-checked]:not([data-disabled]):not([data-readonly])":
                {
                    transform:
                        "translateX(calc(var(--switch-width) - var(--switch-thumb-active-size) - var(--switch-thumb-gap)))",
                    transformOrigin: "right center"
                },
            "--switch-thumb-bg": "white",
            "--switch-thumb-size": "calc(var(--switch-height) * 0.8)",
            "--switch-thumb-gap": "calc(var(--switch-height) * 0.1)",
            "--switch-thumb-active-size": "calc(var(--switch-height) * 1.1)"
        },
        control: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            cursor: "inherit",
            mr: 2,
            flexShrink: 0,
            overflow: "hidden",
            bg: "alpha.100",
            borderRadius: "full",
            transition: "border-color 0.1s, background-color 0.1s",
            height: "var(--switch-height)",
            width: "var(--switch-width)",
            justifyContent: "flex-start",
            "&[data-disabled]": {
                cursor: "not-allowed"
            },
            "&:is(:focus-visible, [data-focus-visible])": {
                boxShadow: "0 0 0 1.5px {colors.primary}"
            },
            "&:is(:focus-visible, [data-focus-visible]):not([data-checked])": {
                bg: "{colors.border}"
            },
            "&:is(:focus-visible, [data-focus-visible])[data-checked]": {
                bg: "var(--switch-bg)"
            },
            "&[data-checked]": {
                bg: "var(--switch-bg)"
            },
            "&[data-invalid]": {
                boxShadow: "0 0 0 1.5px {colors.error}"
            }
        },
        thumb: {
            width: "var(--switch-thumb-size)",
            height: "var(--switch-thumb-size)",
            flexShrink: 0,
            transform: "translateX(var(--switch-thumb-gap))",
            transformOrigin: "left center",
            "&[data-checked]": {
                transform:
                    "translateX(calc(var(--switch-width) - var(--switch-thumb-size) - var(--switch-thumb-gap)))",
                transformOrigin: "right center"
            },
            transition:
                "transform {durations.fast} {easings.easeInOut}, width {durations.fast} {easings.easeInOut}, background {durations.normal} {easings.easeInOut}",
            bg: "var(--switch-thumb-bg)",
            borderRadius: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black"
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
        scheme: "primary"
    },
    variants: {
        size: {
            sm: parts({
                root: {
                    "--switch-width": "sizes.12",
                    "--switch-height": "sizes.6"
                },
                label: {
                    fontSize: "sm"
                }
            }),
            md: parts({
                root: {
                    "--switch-width": "sizes.14",
                    "--switch-height": "sizes.7"
                },
                label: {
                    fontSize: "md"
                }
            }),
            lg: parts({
                root: {
                    "--switch-width": "sizes.16",
                    "--switch-height": "sizes.8"
                },
                label: {
                    fontSize: "lg"
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
