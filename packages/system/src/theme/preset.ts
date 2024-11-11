import { resolveButtonColors } from "@/theme/resolve-button-colors";
import { createSemanticTokens } from "@/theme/semantic-tokens";
import { createTokens } from "@/theme/tokens";
import type { BorderRadius, DeepPartial } from "@/types";
import { type Preset, definePreset } from "@pandacss/dev";
import deepmerge from "deepmerge";
import { parts, recipes } from "../recipes/index";
import { conditions } from "./conditions";
import { globalCss } from "./global-css";
import { keyframes } from "./keyframes";
import { patters } from "./patters/index";
import { staticCss } from "./staticCss";
import { textStyles } from "./text-styles";
import { utilities } from "./utils/index";

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
    primaryColor: string;
    secondaryColor: string;
    rounded: BorderRadius;
    /**
     * Whether to generate boolean utilities.
     * @default true
     */
    useUtilities: boolean;
    /**
     * Color for the primary button. It depends on the `primaryColor` option.
     * @default Dream will automatically resolve contrast to match the `primaryColor` option.
     */
    buttonPrimaryTextColor: string;
    /**
     * Color for the secondary button. It depends on the `secondaryColor` option.
     * @default Dream will automatically resolve contrast to match the `secondaryColor` option.
     */
    buttonSecondaryTextColor: string;
}

export const defaultPresetOptions = {
    backgrounds: {
        light: "#fff",
        dark: "#111117"
    },
    fonts: {
        body: "sans-serif",
        heading: "sans-serif",
        mono: "monospace"
    },
    primaryColor: "{colors.blue.500}",
    secondaryColor: "{colors.purple.400}",
    buttonPrimaryTextColor: "white",
    buttonSecondaryTextColor: "white",
    rounded: "md",
    useUtilities: true
} satisfies PresetOptions;

export function createDreamPreset(
    optionsArg: DeepPartial<PresetOptions> = defaultPresetOptions
): Preset {
    resolveButtonColors(optionsArg);
    if (!optionsArg.fonts?.heading && optionsArg.fonts?.body) {
        optionsArg.fonts.heading = optionsArg.fonts.body;
    }
    const options = deepmerge(defaultPresetOptions, optionsArg) as PresetOptions;

    const semanticTokens = createSemanticTokens(options);
    const tokens = createTokens(options);

    const preset = definePreset({
        name: "dreamy-ui",
        conditions,
        theme: {
            extend: {
                recipes,
                textStyles,
                tokens,
                semanticTokens,
                keyframes
            }
        },
        globalCss,
        utilities,
        patterns: {
            extend: patters
        },
        staticCss
    });

    return preset;
}

export { parts };
