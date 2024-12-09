import { defineParts, defineRecipe } from "@pandacss/dev";
import { getColorSchemes } from "./color-scheme";

const parts = defineParts({
    root: { selector: "&" },
    filledTrack: { selector: "& [data-part=filled-track]" }
});

export const progress = defineRecipe({
    className: "dream-progress",
    jsx: ["Progress", "CircularProgress"],
    base: parts({
        root: {
            width: "full",
            bg: "{colors.alpha.100}",
            overflow: "hidden",
            position: "relative"
        },
        filledTrack: {
            bg: "var(--progress-color)",
            transition: "width 0.3s {easings.easeInOut}",
            height: "full"
        }
    }),
    variants: {
        isIndeterminate: {
            true: parts({
                filledTrack: {
                    position: "absolute",
                    willChange: "left",
                    minWidth: "50%",
                    animation:
                        "progress var(--speed) {easings.ease-in-out} infinite normal none running"
                }
            })
        },
        size: {
            sm: parts({
                root: { h: "1", rounded: "l05" }
            }),
            md: parts({
                root: { h: "2", rounded: "l05" }
            }),
            lg: parts({
                root: { h: "4", rounded: "l1" }
            })
        },
        scheme: getColorSchemes("--progress-color", undefined, "root")
    },
    defaultVariants: {
        size: "md",
        scheme: "primary"
    }
});
