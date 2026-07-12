import { defineRecipe } from "@pandacss/dev";

export const theme = defineRecipe({
    className: "theme",
    description:
        "A root theme wrapper that sets light or dark color-scheme on descendant components. Applies color-scheme via data-theme attribute — no visual variants.",
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
