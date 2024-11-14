import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
    root: {
        selector: "&"
    },
    textWrapper: {
        selector: "[data-skeleton-text-wrapper]:has(&)"
    }
});

export const skeleton = defineRecipe({
    className: "dream-skeleton",
    jsx: ["Skeleton", "SkeletonText"],
    base: parts({
        textWrapper: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            width: "100%"
        }
    }),
    variants: {
        isLoaded: {
            false: {
                borderRadius: "l2",
                boxShadow: "none",
                backgroundClip: "padding-box",
                cursor: "default",
                color: "transparent",
                pointerEvents: "none",
                userSelect: "none",
                flexShrink: "0",
                "&::before, &::after, *": {
                    visibility: "hidden"
                },
                "&[data-skeleton-text]": {
                    width: "100%",
                    height: 4,
                    borderRadius: "l1",
                    "&:last-child:not(:first-child)": {
                        width: "80%"
                    }
                }
            },
            true: {
                background: "unset",
                animation: "fade-in var(--fade-duration, 0.1s) ease-out !important"
            }
        },
        variant: {
            pulse: {
                background: "alpha.200",
                animation: "pulse",
                animationTimingFunction: "ease-in-out",
                animationDuration: "var(--duration, 2s)"
            },
            shine: {
                "--animate-from": "200%",
                "--animate-to": "-200%",
                "--start-color": "colors.alpha.200",
                "--end-color": "colors.alpha.100",
                backgroundImage:
                    "linear-gradient(270deg,var(--start-color),var(--end-color),var(--end-color),var(--start-color))",
                backgroundSize: "400% 100%",
                animation: "bg-position var(--duration, 5s) ease-in-out infinite"
            },
            none: {
                animation: "none",
                background: "alpha.200"
            }
        }
    },
    defaultVariants: {
        variant: "pulse",
        isLoaded: false
    }
});
