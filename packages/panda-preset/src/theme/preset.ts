import { patterns } from "@/theme/patterns";
import { resolveButtonColors } from "@/theme/resolve-button-colors";
import { createSemanticTokens } from "@/theme/semantic-tokens";
import { createTokens } from "@/theme/tokens";
import type { BorderRadius, DeepPartial } from "@/types";
import { type Preset, definePreset } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import deepmerge from "deepmerge";
import { conditions } from "./conditions";
import { globalCss } from "./global-css";
import { keyframes } from "./keyframes";
import { staticCss } from "./staticCss";
import { textStyles } from "./text-styles";
import { utilities } from "./utils/index";

interface LightDarkColor {
	light: string;
	dark: string;
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
} satisfies Omit<
	PresetOptions,
	"buttonPrimaryTextColor" | "buttonSecondaryTextColor"
>;

export default function createDreamyPreset(
	optionsArg: DeepPartial<PresetOptions> = defaultPresetOptions
): Preset {
	if (!optionsArg.fonts?.heading && optionsArg.fonts?.body) {
		optionsArg.fonts.heading = optionsArg.fonts.body;
	}
	const options = deepmerge(
		defaultPresetOptions,
		optionsArg
	) as PresetOptions;
	resolveButtonColors(options);

	const semanticTokens = createSemanticTokens(options);
	const tokens = createTokens(options);

	const preset = definePreset({
		name: "@dreamy-ui/panda-preset",
		conditions,
		presets: [pandaPreset],
		theme: {
			extend: {
				textStyles,
				tokens,
				semanticTokens,
				keyframes
			}
		},
		globalCss,
		utilities,
		patterns: {
			extend: patterns
		},
		staticCss
	});

	return preset;
}
