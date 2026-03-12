import { AsyncLocalStorage } from "node:async_hooks";
import { resolveButtonColors } from "@/theme/resolve-button-colors";
import { createSemanticTokens } from "@/theme/semantic-tokens";
import { createTokens } from "@/theme/tokens";
import type { BorderRadius, DeepPartial } from "@/types";
import { type Preset, definePreset } from "@pandacss/dev";
import deepmerge from "deepmerge";
import { breakpoints } from "./breakpoints";
import { conditions } from "./conditions";
import { containerSizes } from "./containerSizes";
import { globalCss } from "./global-css";
import { keyframes } from "./keyframes";
import { staticCss } from "./staticCss";
import { textStyles } from "./text-styles";
import { utilities } from "./utils/index";

interface LightDarkColor {
    light: string;
    dark: string;
}

export interface LightDarkNumber {
    light: number;
    dark: number;
}

/** Per-token lightness offset for foreground tokens (OKLCH 0–1 scale). */
export interface FgLightnessOffset {
    /** `fg.max` token — the most prominent text (e.g. headings). */
    max?: number | LightDarkNumber;
    /** `fg` / `fg.normal` token — default body text. */
    normal?: number | LightDarkNumber;
    /** `fg.medium` token — secondary / muted text. */
    medium?: number | LightDarkNumber;
    /** `fg.disabled` token — disabled state text. */
    disabled?: number | LightDarkNumber;
}

/** Per-token lightness offset for border tokens (OKLCH 0–1 scale). */
export interface BorderLightnessOffset {
    /**
     * `border` / `border.default` token.
     * @default fgLightnessOffset.normal when `borderLightnessOffset` is not set
     */
    default?: number | LightDarkNumber;
    /**
     * `border.muted` token.
     * @default fgLightnessOffset.disabled when `borderLightnessOffset` is not set
     */
    muted?: number | LightDarkNumber;
    /**
     * `border.hover` token.
     * @default fgLightnessOffset.normal when `borderLightnessOffset` is not set
     */
    hover?: number | LightDarkNumber;
}

interface ColorTuning {
    /**
     * Multiplier applied to the computed foreground token chroma (color tint intensity).
     * Values above `1` increase the color tint of text tokens; values below `1` make them
     * more neutral/grayscale. The result is still clamped to safe bounds.
     * Provide a `{ light, dark }` object to tune each color mode independently.
     * @default 1
     */
    fgChromaScale?: number | LightDarkNumber;
    /**
     * Multiplier applied to the computed border token chroma (color tint intensity).
     * Values above `1` increase the color tint of border tokens; values below `1` make them
     * more neutral/grayscale. The result is still clamped to safe bounds.
     * Provide a `{ light, dark }` object to tune each color mode independently.
     * @default fgChromaScale (falls back to 1 if that is also not set)
     */
    borderChromaScale?: number | LightDarkNumber;
    /**
     * Per-token lightness offset for foreground tokens (OKLCH 0–1 scale).
     * Positive values brighten a token; negative values darken it.
     * Omitted tokens are left at their default lightness.
     */
    fgLightnessOffset?: FgLightnessOffset;
    /**
     * Per-token lightness offset for border tokens (OKLCH 0–1 scale).
     * When this entire option is omitted, border tokens fall back to corresponding
     * fg offsets: `default` ← `fg.normal`, `muted` ← `fg.disabled`, `hover` ← `fg.normal`.
     */
    borderLightnessOffset?: BorderLightnessOffset;
}

export interface PresetOptions {
    backgrounds: {
        light: string;
        dark: string;
    };
    fonts: {
        body: string;
        heading: string;
        mono: string;
    };
    primaryColor: string | LightDarkColor;
    secondaryColor: string | LightDarkColor;
    rounded: BorderRadius;
    /**
     * Color for the primary button. It depends on the `primaryColor` option.
     * @default Dreamy UI will automatically resolve contrast to match the `primaryColor` option.
     */
    buttonPrimaryTextColor: string | LightDarkColor;
    /**
     * Color for the secondary button. It depends on the `secondaryColor` option.
     * @default Dreamy UI will automatically resolve contrast to match the `secondaryColor` option.
     */
    buttonSecondaryTextColor: string | LightDarkColor;
    /**
     * Fine-tune the chroma (color tint intensity) of auto-generated foreground and border tokens.
     * Useful when the default generation feels too colorful or too neutral for a given background.
     */
    colorTuning?: ColorTuning;
}

export const defaultPresetOptions = {
    backgrounds: {
        light: "#fff",
        dark: "#0D0D0E"
    },
    fonts: {
        body: "sans-serif",
        heading: "sans-serif",
        mono: "monospace"
    },
    primaryColor: {
        light: "#000000",
        dark: "#ffffff"
    },
    secondaryColor: {
        light: "#000000",
        dark: "#ffffff"
    },
    // buttonPrimaryTextColor: "{colors.bg}",
    // buttonSecondaryTextColor: "{colors.bg}",
    rounded: "md"
} satisfies Omit<PresetOptions, "buttonPrimaryTextColor" | "buttonSecondaryTextColor">;

const presetStorage = new AsyncLocalStorage<PresetOptions>();

export function getPresetOptions() {
    const options = presetStorage.getStore();
    if (!options) {
        throw new Error(
            "Preset options not found in async local storage. Make sure to call setPresetOptions() first."
        );
    }
    return options;
}

export function setPresetOptions(options: PresetOptions) {
    void presetStorage.enterWith(options);
}

export default function createDreamyPreset(
    optionsArg: DeepPartial<PresetOptions> = defaultPresetOptions
): Preset {
    if (!optionsArg.fonts?.heading && optionsArg.fonts?.body) {
        optionsArg.fonts.heading = optionsArg.fonts.body;
    }
    const options = deepmerge(defaultPresetOptions, optionsArg) as PresetOptions;

    // Set options in async local storage for other functions to access
    return presetStorage.run(options, () => {
        resolveButtonColors();

        const semanticTokens = createSemanticTokens();
        const tokens = createTokens();

        const preset = definePreset({
            name: "@dreamy-ui/panda-preset",
            conditions,
            theme: {
                extend: {
                    colorPalette: {
                        enabled: false
                    },
                    textStyles,
                    tokens,
                    semanticTokens,
                    keyframes,
                    breakpoints,
                    containerSizes
                }
            },
            globalCss,
            utilities,
            staticCss
        });

        return preset;
    });
}
