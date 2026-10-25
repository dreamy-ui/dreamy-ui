import { defineParts, getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    track: { selector: "& [data-part=track]" },
    range: { selector: "& [data-part=range]" }
});

export { parts as progressParts };

export const progress = defineRecipe({
    className: "progress",
    description:
        "A horizontal progress bar for showing completion percentage or loading state. isIndeterminate runs a sliding 50%-width animation on the range instead of a fixed percentage width.",
    jsx: ["Progress", "CircularProgress"],
    base: parts({
        root: {
            width: "full",
            bg: "{colors.alpha.100}",
            overflow: "hidden",
            position: "relative"
        },
        track: {
            width: "full",
            height: "full",
            position: "relative"
        },
        range: {
            bg: "var(--progress-color)",
            transition: "width 0.3s {easings.easeInOut}",
            height: "full"
        }
    }),
    variants: {
        isIndeterminate: {
            true: parts({
                range: {
                    position: "absolute",
                    willChange: "left",
                    minWidth: "50%",
                    animation:
                        "progress var(--speed) {easings.easeInOut} infinite normal none running"
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
