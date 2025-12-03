import { createColorTokens } from "@/theme/semantic-tokens/colors";
import createRadiiTokens from "@/theme/semantic-tokens/radii";
import { defineSemanticTokens } from "@pandacss/dev";
import { fontSizes } from "./font-sizes";
import { shadows } from "./shadows";

export function createSemanticTokens() {
	const radii = createRadiiTokens();
	const colors = createColorTokens();

	return defineSemanticTokens({
		fontSizes,
		colors,
		shadows,
		easings: {
			easeInOut: {
				value: [0.4, 0, 0.3, 1]
			}
		},
		radii
	});
}
