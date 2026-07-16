import { token } from "styled-system/tokens";
import type {
    AspectRatioToken,
    BlurToken,
    ColorToken,
    DurationToken,
    EasingToken,
    FontSizeToken,
    FontToken,
    FontWeightToken,
    LetterSpacingToken,
    LineHeightToken,
    RadiusToken,
    ShadowToken,
    SizeToken,
    SpacingToken,
    ZIndexToken
} from "styled-system/tokens";

export interface TokenEntry {
    name: string;
    value: string;
    pixelValue?: string;
}

const COLOR_STEPS = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950"
] as const;

export const COLOR_SCALES = [
    "rose",
    "pink",
    "fuchsia",
    "purple",
    "violet",
    "indigo",
    "blue",
    "sky",
    "cyan",
    "teal",
    "emerald",
    "green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "red",
    "neutral",
    "stone",
    "zinc",
    "gray",
    "slate",
    "blackAlpha",
    "whiteAlpha"
] as const;

export interface ColorScale {
    key: string;
    tokens: Array<{ name: string; color: ColorToken; value: string }>;
}

export function remToPx(value: string): string | undefined {
    if (value.endsWith("rem")) {
        return `${parseFloat(value) * 16}px`;
    }
    if (value.endsWith("px")) {
        return value;
    }
    return undefined;
}

function spacingEntry(name: SpacingToken): TokenEntry {
    const value = token(`spacing.${name}`);
    return {
        name,
        value,
        pixelValue: remToPx(value)
    };
}

function sizeEntry(name: SizeToken): TokenEntry {
    const value = token(`sizes.${name}`);
    return {
        name,
        value,
        pixelValue: remToPx(value)
    };
}

export const colorScales: ColorScale[] = COLOR_SCALES.map(function mapScale(key) {
    return {
        key,
        tokens: COLOR_STEPS.map(function mapStep(step) {
            const color = `${key}.${step}` as ColorToken;
            return {
                name: `${key}.${step}`,
                color,
                value: token(`colors.${color}`)
            };
        })
    };
});

export const semanticColorGroups = [
    {
        key: "Foreground",
        tokens: ["fg.max", "fg", "fg.medium", "fg.disabled"] as ColorToken[]
    },
    {
        key: "Background",
        tokens: ["bg", "bg.light", "bg.dark", "bg.panel", "bg.subtle", "bg.muted"] as ColorToken[]
    },
    {
        key: "Action",
        tokens: [
            "primary",
            "primary.fg",
            "primary.hover",
            "primary.active",
            "secondary",
            "secondary.fg",
            "secondary.hover",
            "secondary.active"
        ] as ColorToken[]
    },
    {
        key: "Status",
        tokens: [
            "success",
            "success.fg",
            "warning",
            "warning.fg",
            "error",
            "error.fg",
            "info",
            "info.fg"
        ] as ColorToken[]
    },
    {
        key: "Border",
        tokens: ["border", "border.muted", "border.hover"] as ColorToken[]
    },
    {
        key: "Alpha",
        tokens: [
            "alpha.50",
            "alpha.100",
            "alpha.200",
            "alpha.300",
            "alpha.400",
            "alpha.500",
            "alpha.600",
            "alpha.700",
            "alpha.800",
            "alpha.900",
            "alpha.950"
        ] as ColorToken[]
    },
    {
        key: "Other",
        tokens: ["inverted", "tertiary"] as ColorToken[]
    }
];

export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
} as const;

export const spacings: TokenEntry[] = (
    [
        "0",
        "0.5",
        "1",
        "1.5",
        "2",
        "2.5",
        "3",
        "3.5",
        "4",
        "4.5",
        "5",
        "5.5",
        "6",
        "6.5",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "14",
        "16",
        "20",
        "24",
        "28",
        "32",
        "36",
        "40",
        "44",
        "48",
        "52",
        "56",
        "60",
        "64",
        "72",
        "80",
        "96"
    ] as SpacingToken[]
).map(spacingEntry);

export const sizings: TokenEntry[] = (
    [
        "2xs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "8xl",
        "prose",
        "full",
        "min",
        "max",
        "fit"
    ] as SizeToken[]
).map(sizeEntry);

export const radii: Array<TokenEntry & { path: RadiusToken }> = (
    [
        "none",
        "2xs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "full"
    ] as RadiusToken[]
).map(function mapRadius(name) {
    const value = token(`radii.${name}`);
    return {
        name,
        path: name,
        value,
        pixelValue: remToPx(value)
    };
});

export const semanticRadii: Array<TokenEntry & { path: RadiusToken }> = (
    ["l05", "l1", "l2", "l3", "p-2", "p-3", "p-4", "p-5", "p-6"] as RadiusToken[]
).map(function mapSemanticRadius(name) {
    const value = token(`radii.${name}`);
    return {
        name,
        path: name,
        value,
        pixelValue: remToPx(value)
    };
});

export const shadows: Array<TokenEntry & { path: ShadowToken }> = (
    ["xs", "sm", "md", "lg", "xl", "2xl", "inset-2xs", "inset-xs", "inset-sm"] as ShadowToken[]
).map(function mapShadow(name) {
    return {
        name,
        path: name,
        value: token(`shadows.${name}`)
    };
});

export const fonts: Array<TokenEntry & { path: FontToken }> = (
    ["body", "heading", "sans", "serif", "mono"] as FontToken[]
).map(function mapFont(name) {
    return {
        name,
        path: name,
        value: token(`fonts.${name}`)
    };
});

export const fontSizes: Array<TokenEntry & { path: FontSizeToken }> = (
    [
        "2xs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "8xl",
        "9xl"
    ] as FontSizeToken[]
).map(function mapFontSize(name) {
    const value = token(`fontSizes.${name}`);
    return {
        name,
        path: name,
        value,
        pixelValue: remToPx(value)
    };
});

export const fontWeights: Array<TokenEntry & { path: FontWeightToken }> = (
    [
        "thin",
        "extralight",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
        "extrabold",
        "black"
    ] as FontWeightToken[]
).map(function mapFontWeight(name) {
    return {
        name,
        path: name,
        value: token(`fontWeights.${name}`)
    };
});

export const letterSpacings: Array<TokenEntry & { path: LetterSpacingToken }> = (
    ["tighter", "tight", "normal", "wide", "wider", "widest"] as LetterSpacingToken[]
).map(function mapLetterSpacing(name) {
    return {
        name,
        path: name,
        value: token(`letterSpacings.${name}`)
    };
});

export const lineHeights: Array<TokenEntry & { path: LineHeightToken }> = (
    ["none", "tight", "normal", "relaxed", "loose"] as LineHeightToken[]
).map(function mapLineHeight(name) {
    return {
        name,
        path: name,
        value: token(`lineHeights.${name}`)
    };
});

export const blurs: Array<TokenEntry & { path: BlurToken }> = (
    ["sm", "base", "md", "lg", "xl", "2xl", "3xl"] as BlurToken[]
).map(function mapBlur(name) {
    return {
        name,
        path: name,
        value: token(`blurs.${name}`)
    };
});

export const durations: Array<TokenEntry & { path: DurationToken }> = (
    ["fastest", "faster", "fast", "normal", "slow", "slower", "slowest"] as DurationToken[]
).map(function mapDuration(name) {
    return {
        name,
        path: name,
        value: token(`durations.${name}`)
    };
});

export const easings: Array<TokenEntry & { path: EasingToken }> = (
    [
        "pulse",
        "default",
        "emphasized-in",
        "emphasized-out",
        "ease-in-out",
        "ease-in",
        "ease-out"
    ] as EasingToken[]
).map(function mapEasing(name) {
    return {
        name,
        path: name,
        value: token(`easings.${name}`)
    };
});

export const zIndexes: Array<TokenEntry & { path: ZIndexToken }> = (
    [
        "hide",
        "base",
        "docked",
        "dropdown",
        "sticky",
        "banner",
        "overlay",
        "modal",
        "popover",
        "skipLink",
        "toast",
        "tooltip"
    ] as ZIndexToken[]
).map(function mapZIndex(name) {
    return {
        name,
        path: name,
        value: token(`zIndex.${name}`)
    };
});

export const aspectRatios: Array<TokenEntry & { path: AspectRatioToken }> = (
    ["square", "landscape", "portrait", "wide", "ultrawide", "golden"] as AspectRatioToken[]
).map(function mapAspectRatio(name) {
    return {
        name,
        path: name,
        value: token(`aspectRatios.${name}`)
    };
});

export const keyframes = [
    "spin",
    "ping",
    "bounce",
    "pulse",
    "spinner-spin",
    "progress-spin",
    "progress",
    "stripe",
    "bg-position"
] as const;
