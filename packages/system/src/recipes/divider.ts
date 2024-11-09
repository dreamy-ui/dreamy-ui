import { defineRecipe } from "@pandacss/dev";

export const divider = defineRecipe({
    className: "Dream-divider",
    jsx: ["Divider"],
    base: {
        backgroundColor: "{colors.border.muted}",
        borderWidth: 0
    },
    defaultVariants: {
        orientation: "horizontal"
    },
    variants: {
        orientation: {
            horizontal: {
                width: "100%",
                height: "1px"
            },
            vertical: {
                width: "1px",
                height: "100%"
            }
        }
    }
});
