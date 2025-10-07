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

    const isNearlyBlack = bg.oklch.l < 0.1;
    const isStronglySaturated = bg.oklch.c > 0.015;

    let fgHue: number;
    let fgChroma: number;

    if (isNearlyBlack || !isStronglySaturated) {
        // For nearly black or low saturation backgrounds, use blue hue
        fgHue = 245; // Blue hue in OKLCH
        fgChroma = 0.005; // Very minimal blue tint
    } else {
        // For strongly saturated backgrounds, use the background's hue with minimal chroma
        fgHue = bg.oklch.h || 0;
        const cap = 0.02;
        fgChroma = Math.min(bg.oklch.c * 0.2, cap); // 10% of background chroma, capped at 0.02
    }

    const max = new Color("oklch", [isDark ? 1 : 0, fgChroma, fgHue]);
    const normal = new Color("oklch", [isDark ? 0.95 : 0.2, fgChroma, fgHue]);
    const medium = new Color("oklch", [isDark ? 0.7 : 0.35, fgChroma, fgHue]);
    const disabled = new Color("oklch", [isDark ? 0.6 : 0.4, fgChroma, fgHue]);

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
