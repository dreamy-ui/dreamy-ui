import { defineSlotRecipe } from "@pandacss/dev";

export const tooltip = defineSlotRecipe({
    className: "tooltip",
    description:
        "A compact tooltip for brief contextual hints on hover or focus. Inverted colors with dark background and light text, small shadow, and arrow — no variant options.",
    jsx: ["Tooltip"],
    slots: ["root", "trigger", "content"],
    base: {
        root: {
            display: "contents"
        },
        trigger: {
            display: "inline-block"
        },
        content: {
            "--tooltip-bg": "{colors.fg.max}",
            "--tooltip-color": "{colors.bg}",
            "--popper-arrow-bg": "var(--tooltip-bg)",
            bg: "var(--tooltip-bg)",
            color: "var(--tooltip-color)",
            px: 2,
            py: 0.5,
            fontSize: "sm",
            rounded: "l1",
            boxShadow: "md",
            maxW: "xs",
            zIndex: "{zIndex.tooltip}"
        }
    }
});
