import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

const parts = defineParts({
    root: {
        selector: "&"
    },
    circle: {
        selector: "& [data-part='circle']"
    },
    circleTrack: {
        selector: "& [data-part='circleTrack']"
    },
    circleRange: {
        selector: "& [data-part='circleRange']"
    },
    label: {
        selector: "& [data-part='label']"
    },
    valueText: {
        selector: "& [data-part='valueText']"
    }
});

export { parts as progressCircularParts };

export const progressCircular = defineRecipe({
    className: "dreamy-progress-circular",
    base: parts({
        root: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textStyle: "sm",
            position: "relative",
            gap: 2
        },
        circle: {
            "[data-indeterminate]&": {
                animation: "spin 2s linear infinite"
            }
        },
        circleTrack: {
            stroke: "alpha.200"
        },
        circleRange: {
            stroke: "var(--track-color)",
            transitionProperty: "stroke-dasharray",
            transitionDuration: "0.6s",
            "[data-indeterminate]&": {
                animation: "progress-spin var(--speed, 1.5s) linear infinite"
            }
        },
        label: {
            display: "inline-flex"
        },
        valueText: {
            lineHeight: "1",
            fontWeight: "medium",
            letterSpacing: "tight",
            fontVariantNumeric: "tabular-nums",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }
    }),

    variants: {
        size: {
            xs: {
                circle: {
                    "--size": "24px",
                    "--thickness": "2px"
                },
                valueText: {
                    textStyle: "2xs"
                }
            },
            sm: {
                circle: {
                    "--size": "32px",
                    "--thickness": "3px"
                },
                valueText: {
                    textStyle: "2xs"
                }
            },
            md: {
                circle: {
                    "--size": "40px",
                    "--thickness": "4px"
                },
                valueText: {
                    textStyle: "xs"
                }
            },
            lg: {
                circle: {
                    "--size": "48px",
                    "--thickness": "5px"
                },
                valueText: {
                    textStyle: "sm"
                }
            },
            xl: {
                circle: {
                    "--size": "64px",
                    "--thickness": "6px"
                },
                valueText: {
                    textStyle: "sm"
                }
            }
        },
        scheme: getColorSchemes("--track-color", undefined, "root")
    },

    defaultVariants: {
        size: "md",
        scheme: "primary"
    }
});
