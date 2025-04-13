import type { defineConfig } from "@pandacss/dev";

export const staticCss: ReturnType<typeof defineConfig>["staticCss"] = {
    extend: {
        css: [
            {
                properties: {
                    // @ts-expect-error - it works
                    srOnly: [true],
                    position: ["absolute", "relative"],
                    color: ["colors.white/87", "colors.black/87"],
                    aspectRatio: [1],
                    top: [0, "50%"],
                    left: [0],
                    right: [0],
                    bottom: [0],
                    overflow: ["hidden"],
                    flex: [1, "0 0 auto"],
                    w: ["100%", "auto"],
                    h: ["100%"],
                    pos: ["relative"],
                    rounded: ["inherit"],
                    opacity: [0],
                    op: [0],
                    px: ["0 !important"],
                    py: ["0 !important"],
                    display: ["flex"],
                    alignItems: ["center"],
                    lineHeight: ["normal"],
                    whiteSpace: ["nowrap"],
                    transform: ["translateY(-50%)"],
                    visibility: ["visible", "hidden"]
                }
            }
        ],
        patterns: {
            text: [
                {
                    properties: {
                        variant: ["heading"]
                    }
                }
            ]
        }
    }
};
