import { defineRecipe } from "@pandacss/dev";

export const visuallyHidden = defineRecipe({
    className: "Dream-visually-hidden",
    jsx: ["VisuallyHidden", "VisuallyHiddenInput"],
    base: {
        border: "0",
        clip: "rect(0, 0, 0, 0)",
        height: "1px",
        width: "1px",
        margin: "-1px",
        padding: "0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "absolute"
    }
});
