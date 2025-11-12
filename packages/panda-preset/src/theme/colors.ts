import Color from "colorjs.io";

// Simple WCAG contrast check (luminance ratio)
function contrastRatio(c1: Color, c2: Color): number {
    const L1 = c1.luminance + 0.05;
    const L2 = c2.luminance + 0.05;
    return L1 > L2 ? L1 / L2 : L2 / L1;
}

function adjustContrastIfNeeded(color: Color, bg: Color, contrast: number, isDark: boolean) {
    while (
        contrastRatio(bg, color) < contrast &&
        (isDark ? color.oklch.l < 0.99 : color.oklch.l > 0.01)
    ) {
        color.oklch.l += isDark ? 0.02 : -0.02;
    }
}

interface ForegroundTokens {
    max: string;
    normal: string;
    medium: string;
    disabled: string;
}

export function genForegroundTokens(bgHex: string): ForegroundTokens {
    const bg = new Color(bgHex).to("oklch");

    // Decide if background is "dark" or "light" from OKLCH lightness
    const isDark = bg.oklch.l < 0.5;

    // More nuanced saturation thresholds
    const isVeryLowSaturation = bg.oklch.c < 0.01; // Nearly grayscale
    const isLowSaturation = bg.oklch.c < 0.04; // Subtle color
    const isModerateSaturation = bg.oklch.c < 0.12; // Moderate color
    // > 0.12 is considered high saturation

    // Lightness categories
    const isVeryDark = bg.oklch.l < 0.15; // Nearly black
    const isVeryLight = bg.oklch.l > 0.85; // Nearly white
    const isExtremeLightness = isVeryDark || isVeryLight;

    // console.table({
    //     lightness: bg.oklch.l,
    //     chroma: bg.oklch.c,
    //     hue: bg.oklch.h,
    //     isDark,
    //     saturationCategory: isVeryLowSaturation
    //         ? "very-low"
    //         : isLowSaturation
    //           ? "low"
    //           : isModerateSaturation
    //             ? "moderate"
    //             : "high",
    //     isExtremeLightness
    // });

    let fgHue: number;
    let fgChroma: number;

    // Decision tree for hue and chroma
    if (isVeryLowSaturation) {
        // For grayscale or near-grayscale backgrounds, use a neutral blue-gray
        fgHue = 245; // Cool neutral
        fgChroma = 0.005; // Barely perceptible tint
    } else if (isExtremeLightness && isLowSaturation) {
        // Very dark/light + low saturation: use subtle blue
        fgHue = 245;
        fgChroma = 0.008; // Slightly more noticeable than grayscale
    } else {
        // Use the background's hue for foreground
        fgHue = bg.oklch.h || 0;

        // Calculate chroma percentage based on background saturation
        // Higher background saturation = lower foreground chroma percentage
        let chromaPercentage: number;

        if (bg.oklch.c < 0.04) {
            // Low saturation (0.01-0.04): use 40-25% of background chroma
            chromaPercentage = 0.4 - ((bg.oklch.c - 0.01) / 0.03) * 0.15;
        } else if (bg.oklch.c < 0.12) {
            // Moderate saturation (0.04-0.12): use 25-12% of background chroma
            chromaPercentage = 0.25 - ((bg.oklch.c - 0.04) / 0.08) * 0.13;
        } else {
            // High saturation (>0.12): use 12-6% of background chroma
            chromaPercentage = Math.max(0.06, 0.12 - ((bg.oklch.c - 0.12) / 0.2) * 0.06);
        }

        fgChroma = bg.oklch.c * chromaPercentage;

        // Apply minimum and maximum bounds for readability
        fgChroma = Math.max(0.003, Math.min(fgChroma, 0.03));
    }

    // Base chroma for normal text (looks great as-is)
    const normalChroma = fgChroma;

    // Medium and disabled need more chroma since lower lightness = less color perception
    // Apply progressive multipliers to maintain visible color at lower lightness
    const mediumChroma = Math.min(fgChroma * 1.5, 0.05); // 50% more chroma, capped at 0.05
    const disabledChroma = Math.min(fgChroma * 1.3, 0.045); // 30% more chroma, capped at 0.045

    const max = new Color("oklch", [isDark ? 1 : 0, normalChroma, fgHue]);
    const normal = new Color("oklch", [isDark ? 0.95 : 0.2, normalChroma, fgHue]);
    const medium = new Color("oklch", [isDark ? 0.7 : 0.35, mediumChroma, fgHue]);
    const disabled = new Color("oklch", [isDark ? 0.6 : 0.4, disabledChroma, fgHue]);

    adjustContrastIfNeeded(max, bg, 7, isDark);
    adjustContrastIfNeeded(normal, bg, 4.5, isDark);
    adjustContrastIfNeeded(medium, bg, 3, isDark);
    adjustContrastIfNeeded(disabled, bg, 2, isDark);

    return {
        max: max.toString({ format: "oklch" }),
        normal: normal.toString({ format: "oklch" }),
        medium: medium.toString({ format: "oklch" }),
        disabled: disabled.toString({ format: "oklch" })
    };
}
