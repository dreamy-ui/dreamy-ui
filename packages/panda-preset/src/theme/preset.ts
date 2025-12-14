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
	setPresetOptions(options);

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
}
