import { defineRecipe } from "@pandacss/dev";

export const list = defineRecipe({
    className: "list",
    jsx: ["List.Root", "List.Item"],
    base: {
        listStylePosition: "inside",
        "&[data-type=ordered]": {
            listStyleType: "decimal"
        },
        "&[data-type=unordered]": {
            listStyleType: "disc"
        },
        "& li::marker": {
            color: "fg.medium"
        }
    }
});
