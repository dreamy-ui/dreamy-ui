import type { defineConfig } from "@pandacss/dev";

export const conditions: ReturnType<typeof defineConfig>["conditions"] = {
    extend: {
        light: "[data-theme=light] &",
        dark: "[data-theme=dark] &",
        md: "@media (mix-width: 768px)",
        lg: "@media (mix-width: 1024px)"
    }
};
