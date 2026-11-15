import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const rangeSlider = defineSlotRecipe({
    className: "rangeSlider",
    description:
        "A dual-thumb range slider for selecting a min-max value interval. Filled track and thumbs use the scheme color with a white inner dot on each thumb that shrinks when dragging - no variants beyond scheme.",
    jsx: [
        "RangeSlider.Root",
        "RangeSlider.Track",
        "RangeSlider.TrackFilled",
        "RangeSlider.Thumb",
        "RangeSlider.Mark"
    ],
    slots: ["root", "control", "track", "trackFilled", "thumb", "marker"],
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
                borderXWidth: "calc(var(--range-slider-thumb-size) / 2)"
            },
            "[data-orientation=vertical] &": {
                borderYColor: "transparent",
                borderYWidth: "calc(var(--range-slider-thumb-size) / 2)"
            }
        },
        trackFilled: {
            position: "absolute",
            bg: "var(--range-slider-color)",
            "[data-orientation=horizontal] &": {
                height: "full"
            },
            "[data-orientation=vertical] &": {
                width: "full"
            }
        },
        thumb: {
            position: "absolute",
            bg: "var(--range-slider-color)",
            width: "var(--range-slider-thumb-size)",
            height: "var(--range-slider-thumb-size)",
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
            }
        },
        marker: {}
    },
    defaultVariants: {
        scheme: "primary"
    },
    variants: {
        scheme: getColorSchemes("--range-slider-color", undefined, "root")
    }
});
