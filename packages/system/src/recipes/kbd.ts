import { defineRecipe } from "@pandacss/dev";

export const kbd = defineRecipe({
    className: "dream-keyboard-key",
    jsx: ["Kbd", "Menu", "MenuButton"],
    staticCss: [
        {
            size: true
        }
    ],
    base: {
        display: "inline-flex",
        gap: 0.5,
        alignItems: "center",
        bg: "alpha.100",
        width: "fit-content",
        fontWeight: "normal"
    },
    variants: {
        size: {
            sm: {
                px: 1,
                py: 0.25,
                fontSize: "xs",
                rounded: "l1"
            },
            md: {
                px: 1.5,
                py: 0.5,
                fontSize: "sm",
                rounded: "l2"
            },
            lg: {
                px: 2,
                py: 0.75,
                fontSize: "md",
                rounded: "l3"
            }
        }
    },
    defaultVariants: {
        size: "md"
    }
});
