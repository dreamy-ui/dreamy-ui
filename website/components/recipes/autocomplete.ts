import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const autocomplete = defineSlotRecipe({
    className: "autocomplete",
    jsx: ["Autocomplete.Root", "Autocomplete.Input", "Autocomplete.Content", "Autocomplete.VirtualContent", "Autocomplete.Item"],
    slots: [
        "root",
        "control",
        "indicatorGroup",
        "indicator",
        "clearButton",
        "content",
        "item",
        "itemIndicator",
        "noResults"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "1.5",
            width: "auto",
            position: "relative"
        },
        // Structural wrapper that anchors the popover; no border/bg (the Input handles that)
        control: {
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            width: "full"
        },
        indicatorGroup: {
            display: "flex",
            alignItems: "center",
            gap: "1",
            pos: "absolute",
            right: "0",
            top: "0",
            bottom: "0",
            px: "var(--ac-px)",
            pointerEvents: "none"
        },
        indicator: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: {
                base: "fg.medium",
                _disabled: "fg.disabled"
            },
            transition: "transform {durations.normal} {easings.ease-in-out}",
            transform: "rotate(0deg)",
            "[data-open] &": {
                transform: "rotate(180deg)"
            }
        },
        clearButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "fg.medium",
            cursor: "pointer",
            isolation: "isolate",
            pointerEvents: "auto",
            transition: "color {durations.normal} {easings.ease-in-out}",
            _hover: {
                color: "fg"
            },
            _disabled: {
                color: "fg.disabled"
            }
        },
        content: {
            display: "flex",
            flexDirection: "column",
            zIndex: "dropdown",
            borderRadius: "l2!",
            outline: 0,
            maxH: "96",
            p: "0 !important",
            gap: "0 !important",
            overflowY: "auto",
            boxShadow: "md"
        },
        item: {
            position: "relative",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "2",
            cursor: "pointer",
            justifyContent: "space-between",
            flex: "1",
            textAlign: "start",
            borderRadius: "0",
            width: "full",
            _hover: {
                bg: "alpha.50"
            },
            "&[data-focused]": {
                bg: "alpha.50"
            },
            "&[data-selected]": {
                bg: "var(--selected-item-background)",
                color: "var(--selected-item-color)"
            },
            _disabled: {
                pointerEvents: "none",
                opacity: "0.5"
            }
        },
        itemIndicator: {
            position: "absolute"
        },
        noResults: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "fg.medium",
            py: "4",
            px: "2",
            textAlign: "center"
        }
    },
    variants: {
        size: {
            xs: {
                root: {
                    // --ac-px: horizontal padding inside the indicator group
                    // --ac-pe: right padding override injected into Input so text doesn't overlap indicators
                    "--ac-px": "{spacing.2}",
                    "--ac-pe": "{spacing.7}"
                },
                content: { textStyle: "xs" },
                item: { py: "1", px: "2" },
                itemIndicator: { right: "2" },
                indicator: { width: "3.5", height: "3.5" },
                clearButton: {
                    p: 1.5,
                    "& svg": { width: "3.5", height: "3.5" }
                }
            },
            sm: {
                root: {
                    "--ac-px": "{spacing.2.5}",
                    "--ac-pe": "{spacing.8}"
                },
                content: { textStyle: "sm" },
                indicator: { width: "4", height: "4" },
                item: { py: "1", px: "1.5" },
                itemIndicator: { right: "1.5" },
                clearButton: {
                    p: 1.5,
                    "& svg": { width: "3.5", height: "3.5" }
                }
            },
            md: {
                root: {
                    "--ac-px": "{spacing.3}",
                    "--ac-pe": "{spacing.10}"
                },
                content: { textStyle: "sm" },
                item: { py: "1.5", px: "2" },
                itemIndicator: { right: "2" },
                indicator: { width: "4", height: "4" },
                clearButton: {
                    p: 2,
                    "& svg": { width: "4", height: "4" }
                }
            },
            lg: {
                root: {
                    "--ac-px": "{spacing.4}",
                    "--ac-pe": "{spacing.12}"
                },
                content: { textStyle: "md" },
                item: { py: "2", px: "3" },
                itemIndicator: { right: "3" },
                indicator: { width: "5", height: "5" },
                clearButton: {
                    p: 2.5,
                    "& svg": { width: "5", height: "5" }
                }
            }
        },
        selectedItemBackgroundScheme: getColorSchemes(
            "--selected-item-background",
            (scheme) => {
                return {
                    "--selected-item-color":
                        scheme === "primary"
                            ? "{colors.primary.fg}"
                            : scheme === "secondary"
                              ? "{colors.secondary.fg}"
                              : scheme === "success" || scheme === "warning" || scheme === "info"
                                ? "color-mix(in srgb, black 87%, transparent)"
                                : scheme === "none"
                                  ? "colors.bg"
                                  : "color-mix(in srgb, white 87%, transparent)"
                } as Record<any, any>;
            },
            "content"
        )
    },
    defaultVariants: {
        size: "md",
        selectedItemBackgroundScheme: "primary"
    }
});
