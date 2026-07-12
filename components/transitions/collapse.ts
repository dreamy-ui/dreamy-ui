import { defineRecipe } from "@pandacss/dev";

export const collapse = defineRecipe({
    className: "collapse",
    description: "Collapse transition wrapper with hidden overflow for animated height changes.",
    jsx: ["Collapse"],
    base: {
        overflow: "hidden",
        display: "block"
    }
});
