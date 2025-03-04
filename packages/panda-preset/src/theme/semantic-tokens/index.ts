import type { PresetOptions } from "@/theme/preset";
import { createColorTokens } from "@/theme/semantic-tokens/colors";
import createRadiiTokens from "@/theme/semantic-tokens/radii";
import { defineSemanticTokens } from "@pandacss/dev";
import animations from "./animations";
import { fontSizes } from "./font-sizes";
import shadows from "./shadows";

export function createSemanticTokens(options: PresetOptions) {
    const radii = createRadiiTokens(options.rounded);
    const colors = createColorTokens(options);

    return defineSemanticTokens({
        fontSizes,
        colors,
        shadows,
        animations,
        easings: {
            easeInOut: {
                value: [0.4, 0, 0.3, 1]
            }
        },
        radii
    });
}
