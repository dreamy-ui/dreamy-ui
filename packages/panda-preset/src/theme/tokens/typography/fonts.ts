import { getPresetOptions } from "@/theme/preset";
import type { Tokens } from "@pandacss/dev";

export function createFonts(): Tokens["fonts"] {
    const {
        fonts: { body, heading, mono }
    } = getPresetOptions();

    return {
        body: {
            value: [body, "sans"]
        },
        heading: {
            value: [heading, body, "sans"]
        },
        sans: {
            value: [
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "BlinkMacSystemFont",
                '"Segoe UI"',
                "Roboto",
                '"Helvetica Neue"',
                "Arial",
                '"Noto Sans"',
                "sans-serif",
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"'
            ]
        },
        serif: {
            value: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"]
        },
        mono: {
            value: [
                mono,
                "ui-monospace",
                "SFMono-Regular",
                "Menlo",
                "Monaco",
                "Consolas",
                '"Liberation Mono"',
                '"Courier New"',
                "monospace"
            ]
        }
    };
}
