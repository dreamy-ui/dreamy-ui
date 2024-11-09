import { defineRecipe } from "@pandacss/dev";

export const flex = defineRecipe({
    className: "dream-flex",
    jsx: ["Flex", "DreamFlex"],
    base: {
        display: "flex"
    },
    staticCss: ["*"]
});
