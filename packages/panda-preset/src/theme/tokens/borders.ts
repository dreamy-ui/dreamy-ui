import { defineTokens } from "@pandacss/dev";

export const borders = defineTokens.borders({
    none: { value: "none" },
    default: { value: "1px solid {colors.border}" },
    muted: { value: "1px solid {colors.border.muted}" },
    hover: { value: "1px solid {colors.border.hover}" }
});
