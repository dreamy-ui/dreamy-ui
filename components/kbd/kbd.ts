import { defineRecipe } from "@pandacss/dev";

export const kbd = defineRecipe({
    className: "kbd",
    description:
        "Inline keyboard key styling that visually represents shortcuts or key presses. The subtle variant has a soft tinted background with rounded corners, the plain variant has no background and muted text. Size changes padding, font size, and border radius.",
    jsx: ["Kbd", "Menu", "MenuButton", "MenuItem"],
    staticCss: ["*"],
    base: {
        display: "inline-flex",
        gap: 0.5,
        alignItems: "center",
        width: "fit-content",
        fontWeight: "normal"
    },
    variants: {
        variant: {
            subtle: {
                bg: "alpha.100"
            },
            plain: {
                bg: "transparent",
                color: "fg.medium"
            }
        },
        size: {
            sm: {
                px: 1,
                py: 0.25,
                fontSize: "xs",
                rounded: "l2"
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
        variant: "subtle",
        size: "md"
    }
});
