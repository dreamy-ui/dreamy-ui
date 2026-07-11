import { defineRecipe } from "@pandacss/dev";

export const list = defineRecipe({
    className: "list",
    description:
        "An ordered or unordered list for rendering sequential or bulleted items. Uses decimal or disc markers in medium foreground color — no variant options.",
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
