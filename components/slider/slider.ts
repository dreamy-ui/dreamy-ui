import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const slider = defineSlotRecipe({
    className: "slider",
    description:
        "A single-thumb slider for selecting a numeric value along a track. Filled range and thumb use the scheme color; thumb has a white inner circle that shrinks when dragging - no variants beyond scheme.",
    jsx: ["Slider.Root", "Slider.Track", "Slider.TrackFilled", "Slider.Thumb", "Slider.Mark"],
    slots: ["root", "control", "track", "trackFilled", "thumb", "marker"],
    staticCss: ["*"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "full",
            userSelect: "none",
            touchAction: "none",
            "&[data-disabled]": {
                cursor: "not-allowed",
                opacity: 0.5
            }
        },
        control: {
            position: "relative",
            width: "full",
            height: "full",
            cursor: "pointer",
            touchAction: "none",
            "[data-disabled] &": {
                cursor: "not-allowed"
            }
        },
        track: {
            position: "relative",
            width: "full",
            height: "full",
            bg: "alpha.100",
            borderRadius: "full",
            "[data-orientation=horizontal] &": {
                borderXColor: "transparent",
                borderXWidth: "calc(var(--slider-thumb-size) / 2)",
                borderInlineStartColor: "var(--slider-color)"
            },
            "[data-orientation=vertical] &": {
                borderYColor: "transparent",
                borderYWidth: "calc(var(--slider-thumb-size) / 2)",
                borderBottomColor: "var(--slider-color)"
            },
            "[data-hide-thumb] &": {
                borderWidth: "0",
                overflow: "hidden"
            }
        },
        trackFilled: {
            position: "absolute",
            bg: "var(--slider-color)",
            "[data-hide-thumb] &": {
                borderRadius: "full"
            },
            "[data-orientation=horizontal] &": {
                height: "full"
            },
            "[data-orientation=vertical] &": {
                width: "full"
            }
        },
        thumb: {
            position: "absolute",
            bg: "var(--slider-color)",
            width: "var(--slider-thumb-size)",
            height: "var(--slider-thumb-size)",
            borderRadius: "full",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            _invalid: {
                boxShadow: "0 0 0 1.5px {colors.error}"
            },
            _after: {
                content: '""',
                width: "70%",
                height: "70%",
                display: "block",
                bg: "{colors.bg}",
                borderRadius: "full",
                transition: "scale 0.2s {easings.easeInOut}"
            },
            "&[data-dragging]": {
                cursor: "grabbing",
                _after: {
                    scale: 0.8
                }
            },
            "[data-disabled] &": {
                cursor: "not-allowed"
            },
            // Ark already shifts the thumb along the track axis, so only center it on the cross axis.
            "[data-orientation=horizontal] &": {
                top: "50%",
                translate: "0 -50%"
            },
            "[data-orientation=vertical] &": {
                left: "50%",
                translate: "-50% 0"
            },
            "[data-hide-thumb] &": {
                display: "none",
                pointerEvents: "none"
            }
        },
        marker: {}
    },
    defaultVariants: {
        scheme: "primary"
    },
    variants: {
        scheme: getColorSchemes("--slider-color", undefined, "root")
    }
});
