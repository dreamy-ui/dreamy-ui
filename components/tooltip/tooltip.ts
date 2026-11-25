import { defineSlotRecipe } from "@pandacss/dev";

export const tooltip = defineSlotRecipe({
    className: "tooltip",
    description:
        "A compact tooltip for brief contextual hints on hover or focus. Inverted colors with dark background and light text, small shadow, and arrow — no variant options.",
    slots: ["trigger", "content", "arrow"],
    jsx: ["Tooltip", "TooltipArrow"],
    base: {
        trigger: {
            display: "inline-block"
        },
        content: {
            "--tooltip-bg": "{colors.fg.max}",
            "--tooltip-color": "{colors.bg}",
            "--arrow-size": "8px",
            "--arrow-background": "var(--tooltip-bg)",
            bg: "var(--tooltip-bg)",
            color: "var(--tooltip-color)",
            px: 2,
            py: 0.5,
            fontSize: "sm",
            rounded: "l1",
            boxShadow: "md",
            maxW: "xs",
            zIndex: "{zIndex.tooltip}",
            position: "relative",
            overflow: "visible",
            transformOrigin: "var(--transform-origin, center)"
        },
        arrow: {
            "--arrow-size": "8px",
            "--arrow-background": "var(--tooltip-bg)",
            width: "var(--arrow-size)",
            height: "var(--arrow-size)",
            background: "var(--arrow-background)",
            rotate: "45deg",
            pointerEvents: "none",
            zIndex: -1,
            "&[data-side='bottom']": {
                top: "calc(var(--arrow-size) / -2)"
            },
            "&[data-side='top']": {
                bottom: "calc(var(--arrow-size) / -2)"
            },
            "&[data-side='left']": {
                right: "calc(var(--arrow-size) / -2)"
            },
            "&[data-side='right']": {
                left: "calc(var(--arrow-size) / -2)"
            }
        }
    }
});
