import { assets } from "@/theme/tokens/assets";
import { defineColorTokens } from "@/theme/tokens/colors";
import { createFonts } from "@/theme/tokens/typography/fonts";
import { defineTokens } from "@pandacss/dev";
import { animations } from "../keyframes";
import { aspectRatios } from "./aspect-ratios";
import { blurs } from "./blurs";
import { borders } from "./borders";
import { durations } from "./durations";
import { easings } from "./easings";
import { radii } from "./radii";
import { sizes } from "./sizes";
import { spacing } from "./spacing";
import { fontSizes } from "./typography/font-sizes";
import { fontWeights } from "./typography/font-weights";
import { letterSpacings } from "./typography/letter-spacings";
import { lineHeights } from "./typography/line-heights";
import { zIndex } from "./z-index";

export function createTokens(): Required<ReturnType<typeof defineTokens>> {
	const fonts = createFonts();
	const colors = defineColorTokens();

	return defineTokens({
		aspectRatios,
		blurs,
		borders,
		animations,
		colors,
		durations,
		assets,
		easings,
		fonts,
		fontSizes,
		fontWeights,
		letterSpacings,
		lineHeights,
		radii,
		sizes,
		spacing,
		zIndex
	});
}
