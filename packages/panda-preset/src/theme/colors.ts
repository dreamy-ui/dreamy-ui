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

interface BorderTokens {
    default: string;
    muted: string;
    hover: string;
}

function getFgChroma(bg: Color) {
    const isVeryLowSaturation = bg.oklch.c < 0.01; // Nearly grayscale
    const isLowSaturation = bg.oklch.c < 0.04; // Subtle color
    const isModerateSaturation = bg.oklch.c < 0.12; // Moderate color

    const isVeryDark = bg.oklch.l < 0.15; // Nearly black
    const isVeryLight = bg.oklch.l > 0.85; // Nearly white
    const isExtremeLightness = isVeryDark || isVeryLight;

    // console.table({
    // 	lightness: bg.oklch.l,
    // 	chroma: bg.oklch.c,
    // 	hue: bg.oklch.h,
    // 	isDark: bg.oklch.l < 0.5,
    // 	saturationCategory: isVeryLowSaturation
    // 		? "very-low"
    // 		: isLowSaturation
    // 			? "low"
    // 			: isModerateSaturation
    // 				? "moderate"
    // 				: "high",
    // 	isExtremeLightness
    // });

    let fgHue: number;
    let fgChroma: number;

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
        // Increased percentages to add more visible chroma
        let chromaPercentage: number;

        if (isLowSaturation) {
            // Low saturation (0.01-0.04): use 60-40% of background chroma (increased from 40-25%)
            chromaPercentage = 0.6 - ((bg.oklch.c - 0.01) / 0.03) * 0.2;
        } else if (isModerateSaturation) {
            // Moderate saturation (0.04-0.12): use 40-20% of background chroma (increased from 25-12%)
            chromaPercentage = 0.4 - ((bg.oklch.c - 0.04) / 0.08) * 0.2;
        } else {
            // High saturation (>0.12): use 20-10% of background chroma (increased from 12-6%)
            chromaPercentage = Math.max(0.1, 0.2 - ((bg.oklch.c - 0.12) / 0.2) * 0.1);
        }

        fgChroma = bg.oklch.c * chromaPercentage;

        // Apply minimum and maximum bounds for readability
        // Increased max from 0.03 to 0.05 for more visible chroma
        fgChroma = Math.max(0.005, Math.min(fgChroma, 0.05));
    }

    return { fgChroma, fgHue };
}

function getBorderChroma(bg: Color) {
    const isVeryLowSaturation = bg.oklch.c < 0.01; // Nearly grayscale
    const isLowSaturation = bg.oklch.c < 0.04; // Subtle color
    const isModerateSaturation = bg.oklch.c < 0.12; // Moderate color

    const isVeryDark = bg.oklch.l < 0.15; // Nearly black
    const isVeryLight = bg.oklch.l > 0.85; // Nearly white
    const isExtremeLightness = isVeryDark || isVeryLight;

    let borderHue: number;
    let borderChroma: number;

    if (isVeryLowSaturation) {
        // For grayscale or near-grayscale backgrounds, use a neutral blue-gray
        borderHue = 245; // Cool neutral
        borderChroma = 0.006; // Slightly more than foreground
    } else if (isExtremeLightness && isLowSaturation) {
        // Very dark/light + low saturation: use subtle blue
        borderHue = 245;
        borderChroma = 0.01; // More noticeable than foreground
    } else {
        // Use the background's hue for border
        borderHue = bg.oklch.h || 0;

        // Calculate chroma percentage based on background saturation
        // Higher background saturation = lower border chroma percentage
        // Slightly higher percentages than foreground for more visible borders
        let chromaPercentage: number;

        if (isLowSaturation) {
            // Low saturation (0.01-0.04): use 70-50% of background chroma (vs 60-40% for foreground)
            chromaPercentage = 0.7 - ((bg.oklch.c - 0.01) / 0.03) * 0.2;
        } else if (isModerateSaturation) {
            // Moderate saturation (0.04-0.12): use 50-30% of background chroma (vs 40-20% for foreground)
            chromaPercentage = 0.5 - ((bg.oklch.c - 0.04) / 0.08) * 0.2;
        } else {
            // High saturation (>0.12): use 30-15% of background chroma (vs 20-10% for foreground)
            chromaPercentage = Math.max(0.15, 0.3 - ((bg.oklch.c - 0.12) / 0.2) * 0.15);
        }

        borderChroma = bg.oklch.c * chromaPercentage;

        // Apply minimum and maximum bounds for readability
        // Slightly higher max than foreground (0.06 vs 0.05) for more visible borders
        borderChroma = Math.max(0.006, Math.min(borderChroma, 0.06));
    }

    return { borderChroma, borderHue };
}

export function genForegroundTokens(bgHex: string): ForegroundTokens {
    const bg = new Color(bgHex).to("oklch");
    const { fgChroma, fgHue } = getFgChroma(bg);
    const isDark = bg.oklch.l < 0.5;

    // Medium and disabled need more chroma since lower lightness = less color perception
    // Apply progressive multipliers to maintain visible color at lower lightness
    const mediumChroma = Math.min(fgChroma * 1.5, 0.05); // 50% more chroma, capped at 0.05
    const disabledChroma = Math.min(fgChroma * 1.3, 0.045); // 30% more chroma, capped at 0.045

    const max = new Color("oklch", [isDark ? 1 : 0, fgChroma, fgHue]);
    const normal = new Color("oklch", [isDark ? 0.95 : 0.2, fgChroma, fgHue]);
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

export function genBorderTokens(bgHex: string): BorderTokens {
    const bg = new Color(bgHex).to("oklch");
    const { borderChroma, borderHue } = getBorderChroma(bg);
    const isDark = bg.oklch.l < 0.5;

    const mutedChroma = Math.min(borderChroma * 1.2, 0.05);
    const hoverChroma = borderChroma;

    const defaultBorder = new Color("oklch", [isDark ? 0.25 : 0.9, borderChroma, borderHue]);
    const mutedBorder = new Color("oklch", [isDark ? 0.2 : 0.95, mutedChroma, borderHue]);
    const hoverBorder = new Color("oklch", [isDark ? 0.3 : 0.85, hoverChroma, borderHue]);

    return {
        default: defaultBorder.toString({ format: "oklch" }),
        muted: mutedBorder.toString({ format: "oklch" }),
        hover: hoverBorder.toString({ format: "oklch" })
    };
}

export function alpha(color: string, amount: number) {
    const normal = new Color(color);

    normal.alpha = amount;

    return normal.toString({ format: "oklch" });
}
