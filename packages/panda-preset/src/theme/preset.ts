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
    light?: number;
    dark?: number;
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
     * @default `fg.lightness.normal` when `border.lightness` is not set
     */
    default?: number | LightDarkNumber;
    /**
     * `border.muted` token.
     * @default `fg.lightness.disabled` when `border.lightness` is not set
     */
    muted?: number | LightDarkNumber;
    /**
     * `border.hover` token.
     * @default `fg.lightness.normal` when `border.lightness` is not set
     */
    hover?: number | LightDarkNumber;
}

export interface FgColorTuning {
    /**
     * Multiplier applied to the computed foreground token chroma (color tint intensity).
     * Values above `1` increase the color tint of text tokens; values below `1` make them
     * more neutral/grayscale. The result is still clamped to safe bounds.
     * @default 1
     */
    chroma?: number | LightDarkNumber;
    /**
     * Per-token lightness offset for foreground tokens (OKLCH 0–1 scale).
     * Positive values brighten a token; negative values darken it.
     */
    lightness?: FgLightnessOffset;
}

export interface BorderColorTuning {
    /**
     * Multiplier applied to the computed border token chroma (color tint intensity).
     * @default `fg.chroma` (falls back to `1` if that is also not set)
     */
    chroma?: number | LightDarkNumber;
    /**
     * Per-token lightness offset for border tokens (OKLCH 0–1 scale).
     * When omitted entirely, border tokens fall back to corresponding fg offsets:
     * `default` ← `fg.lightness.normal`, `muted` ← `fg.lightness.disabled`, `hover` ← `fg.lightness.normal`.
     */
    lightness?: BorderLightnessOffset;
}

export interface AlphaColorTuning {
    /**
     * OKLCH hue (0–360°) — which color the alpha overlay is tinted toward.
     * Only visible when {@link chroma} is greater than `0`.
     *
     * **Hue guide (OKLCH degrees):**
     * - `0` / `360` — red
     * - `30` — orange
     * - `60` — yellow
     * - `90` — lime / yellow-green
     * - `120` — green
     * - `150` — teal
     * - `180` — cyan
     * - `210` — sky blue
     * - `240` — blue
     * - `270` — indigo / violet
     * - `300` — magenta / fuchsia
     * - `330` — pink / rose
     *
     * @default 245
     */
    hue?: number | LightDarkNumber;
    /**
     * OKLCH chroma (0–0.4) — how much color is mixed into alpha overlays.
     * `0` keeps neutral grayscale overlays (default).
     *
     * Pair with {@link hue} to control tint direction and strength.
     *
     * **Hue guide (set on {@link hue}, OKLCH degrees):**
     * - `25` — red
     * - `60` — yellow
     * - `120` — green
     * - `180` — cyan
     * - `240` — blue
     * - `300` — magenta
     *
     * **Chroma intensity guide:**
     * - `0` — neutral black/white alpha (no tint)
     * - `0.005`–`0.01` — barely perceptible tint
     * - `0.01`–`0.02` — subtle UI tint (borders, muted fills)
     * - `0.02`–`0.04` — noticeable brand-colored overlays
     * - `0.04`+ — strong accent tint (use sparingly)
     *
     * @default 0
     */
    chroma?: number | LightDarkNumber;
}

export interface ColorTuning {
    fg?: FgColorTuning;
    border?: BorderColorTuning;
    alpha?: AlphaColorTuning;
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
     * Fine-tune auto-generated foreground, border, and alpha tokens.
     * Useful when default generation feels too colorful, too neutral, or when you want
     * tinted translucent overlays (e.g. blue-ish `alpha` via chroma + hue).
     */
    colorTuning?: ColorTuning;
}

export const defaultPresetOptions: Omit<
    PresetOptions,
    "buttonPrimaryTextColor" | "buttonSecondaryTextColor"
> = {
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
};

const presetStorage = new AsyncLocalStorage<PresetOptions>();

export function getPresetOptions(): PresetOptions {
    const options = presetStorage.getStore();
    if (!options) {
        throw new Error(
            "Preset options not found in async local storage. Make sure to call setPresetOptions() first."
        );
    }
    return options;
}

export function setPresetOptions(options: PresetOptions): void {
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
