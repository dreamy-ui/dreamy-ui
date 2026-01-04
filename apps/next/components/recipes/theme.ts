import { defineRecipe } from "@pandacss/dev";

export const theme = defineRecipe({
    className: "theme",
    description: "Dreamy UI Theme component",
    jsx: ["DarkTheme", "LightTheme"],
    base: {
        root: {
            color: "fg",
            "&[data-theme='dark']": {
                colorScheme: "dark"
            },
            "&[data-theme='light']": {
                colorScheme: "light"
            }
        }
    }
});
