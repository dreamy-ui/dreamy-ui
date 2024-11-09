import { defineRecipe } from "@pandacss/dev";

export const list = defineRecipe({
    className: "Dream-list",
    jsx: ["List", "ListItem"],
    base: {
        listStylePosition: "inside",
        "&[data-type=ordered]": {
            listStyleType: "decimal"
        },
        "&[data-type=unordered]": {
            listStyleType: "disc"
        }
    }
});
