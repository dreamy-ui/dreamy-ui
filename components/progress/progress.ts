import { defineParts, getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: { selector: "&" },
    header: { selector: "& [data-part=header]" },
    label: { selector: "& [data-part=label]" },
    value: { selector: "& [data-part=value]" },
    track: { selector: "& [data-part=track]" },
    range: { selector: "& [data-part=range]" }
});

export { parts as progressParts };

const progressSchemeVariants = Object.fromEntries(
    Object.entries(getColorSchemes("--progress-color")).map(([name, styles]) => [
        name,
        parts({ root: styles })
    ])
);

export const progress = defineRecipe({
    className: "progress",
    description:
        "A horizontal progress bar for showing completion percentage or loading state. isIndeterminate runs a sliding 50%-width animation on the range instead of a fixed percentage width.",
    jsx: ["Progress", "CircularProgress"],
    base: parts({
        root: {
            width: "full",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            position: "relative"
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2
        },
        label: {
            textStyle: "sm",
            fontWeight: "medium",
            color: "fg"
        },
        value: {
            textStyle: "sm",
            color: "fg.medium",
            fontVariantNumeric: "tabular-nums"
        },
        track: {
            width: "full",
            bg: "{colors.alpha.100}",
            overflow: "hidden",
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
                track: { h: "1", rounded: "l05" }
            }),
            md: parts({
                track: { h: "2", rounded: "l05" }
            }),
            lg: parts({
                track: { h: "4", rounded: "l1" }
            })
        },
        scheme: progressSchemeVariants
    },
    defaultVariants: {
        size: "md",
        scheme: "primary"
    }
});
