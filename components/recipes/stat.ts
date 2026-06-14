import { defineSlotRecipe } from "@pandacss/dev";

export const stat = defineSlotRecipe({
    className: "stat",
    slots: ["root", "label", "hint", "valueUnit", "valueText", "indicator"],
    jsx: [
        "Stat.Root",
        "Stat.Label",
        "Stat.Hint",
        "Stat.ValueUnit",
        "Stat.ValueText",
        "Stat.Indicator"
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            position: "relative",
            flex: "1"
        },
        label: {
            display: "inline-flex",
            gap: "1.5",
            alignItems: "center",
            color: "fg.medium",
            textStyle: "sm"
        },
        hint: {
            color: "fg.medium",
            textStyle: "xs"
        },
        valueUnit: {
            color: "fg.medium",
            textStyle: "xs",
            fontWeight: "initial",
            letterSpacing: "initial"
        },
        valueText: {
            alignItems: "baseline",
            verticalAlign: "baseline",
            fontWeight: "semibold",
            letterSpacing: "tight",
            fontFeatureSettings: "pnum",
            fontVariantNumeric: "proportional-nums",
            display: "inline-flex",
            gap: "1"
        },
        indicator: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginEnd: 1,
            "& :where(svg)": {
                w: "1em",
                h: "1em"
            },
            "&[data-type=up]": {
                color: "success"
            },
            "&[data-type=down]": {
                color: "error"
            }
        }
    },
    variants: {
        size: {
            sm: {
                valueText: {
                    textStyle: "xl"
                }
            },
            md: {
                valueText: {
                    textStyle: "2xl"
                }
            },
            lg: {
                valueText: {
                    textStyle: "3xl"
                }
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
