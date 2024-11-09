import { defineRecipe } from "@pandacss/dev";

export const text = defineRecipe({
    className: "dream-text",
    jsx: ["Heading", "Text"],
    staticCss: ["*"],
    variants: {
        variant: {
            heading: {
                fontWeight: "bold",
                fontFamily: "{fonts.heading}"
            },
            link: {
                fontWeight: "semibold",
                transition: "colors",
                _hover: {
                    color: "{colors.fg.max}"
                }
            }
        },
        size: {
            xs: { textStyle: "xs" },
            sm: { textStyle: "sm" },
            md: { textStyle: "md" },
            lg: { textStyle: "lg" },
            xl: { textStyle: "xl" },
            "2xl": { textStyle: "2xl" },
            "3xl": { textStyle: "3xl" },
            "4xl": { textStyle: "4xl" },
            "5xl": {
                textStyle: "5xl"
            },
            "6xl": {
                textStyle: "6xl"
            },
            "7xl": {
                textStyle: "7xl"
            }
        }
    }
});
