import { getColorSchemes } from "@/recipes/color-scheme";
import { defineSlotRecipe } from "@pandacss/dev";

export const slider = defineSlotRecipe({
    className: "dream-slider",
    jsx: ["Slider", "SliderTrack", "SliderTrackFilled", "SliderThumb", "SliderMark"],
    slots: ["root", "track", "trackFilled", "thumb", "marker"],
    staticCss: ["*"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "full",
            maxW: "400px"
        },
        track: {
            touchAction: "none",
            position: "relative",
            width: "full",
            bg: "alpha.100",
            borderRadius: "full",
            height: "full",
            cursor: "pointer",
            display: "flex",
            "[data-reversed] &": {
                flexDirection: "row-reverse"
            },
            "[data-orientation=vertical] &": {
                borderYColor: "transparent",
                borderYWidth: "calc(28px / 2)",
                flexDirection: "column-reverse",
                borderBottomColor: "var(--slider-color)"
            },
            "[data-orientation=vertical][data-reversed] &": {
                flexDirection: "column",
                borderBottomColor: "transparent",
                borderTopColor: "var(--slider-color)"
            },
            "[data-orientation=horizontal] &": {
                borderXColor: "transparent",
                borderInlineStartColor: "var(--slider-color)",
                borderXWidth: "calc(28px / 2)"
            },
            "[data-orientation=horizontal][data-reversed] &": {
                flexDirection: "row-reverse",
                borderInlineStartColor: "transparent",
                borderInlineEndColor: "var(--slider-color)"
            }
        },
        trackFilled: {
            bg: "var(--slider-color)",
            "[data-orientation=horizontal] &": {
                height: "full"
            },
            "[data-orientation=vertical] &": {
                width: "full"
            }
        },
        thumb: {
            position: "absolute",
            width: "7",
            height: "7",
            bg: "var(--slider-color)",
            borderRadius: "full",
            translate: "auto",
            scale: "auto",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            _after: {
                content: '""',
                width: "70%",
                height: "70%",
                display: "block",
                bg: "{colors.bg}",
                borderRadius: "full",
                transition: "scale 0.2s {easings.ease-in-out}"
            },
            _active: {
                cursor: "grabbing",
                _after: {
                    scale: 0.8
                }
            },
            "[data-orientation=horizontal] &": {
                top: "50%",
                translateY: "-50%",
                translateX: "-50%"
            },
            "[data-orientation=vertical] &": {
                left: "50%",
                translateY: "50%",
                translateX: "-50%"
            }
        },
        marker: {}
    },
    defaultVariants: {
        size: "md",
        scheme: "primary"
    },
    variants: {
        size: {
            sm: {
                root: {
                    "&[data-orientation=horizontal]": {
                        height: "2"
                    },
                    "&[data-orientation=vertical]": {
                        width: "2"
                    }
                }
            },
            md: {
                root: {
                    "&[data-orientation=horizontal]": {
                        height: "4"
                    },
                    "&[data-orientation=vertical]": {
                        width: "4"
                    }
                }
            },
            lg: {
                root: {
                    "&[data-orientation=horizontal]": {
                        height: "7"
                    },
                    "&[data-orientation=vertical]": {
                        width: "7"
                    }
                }
            }
        },
        scheme: getColorSchemes("--slider-color", undefined, "root")
    }
});
