import { getPresetOptions } from "@/theme/preset";
import { defineSemanticTokens } from "@pandacss/dev";
import {
    type ResolvedBorderOffsets,
    type ResolvedFgOffsets,
    alpha,
    genBorderTokens,
    genForegroundTokens
} from "../colors";

function resolveNumber(
    val: number | { light: number; dark: number } | undefined,
    mode: "light" | "dark",
    fallback: number
): number {
    if (val === undefined) return fallback;
    if (typeof val === "number") return val;
    return val[mode];
}

export function createColorTokens() {
    const {
        backgrounds: { light: lightBackground, dark: darkBackground },
        primaryColor,
        secondaryColor,
        buttonPrimaryTextColor,
        buttonSecondaryTextColor,
        colorTuning
    } = getPresetOptions();

    // ── Chroma scales ──────────────────────────────────────────────────────────
    const fgChromaScaleLight = resolveNumber(colorTuning?.fgChromaScale, "light", 1);
    const fgChromaScaleDark = resolveNumber(colorTuning?.fgChromaScale, "dark", 1);

    const borderChromaScaleLight = resolveNumber(
        colorTuning?.borderChromaScale,
        "light",
        fgChromaScaleLight
    );
    const borderChromaScaleDark = resolveNumber(
        colorTuning?.borderChromaScale,
        "dark",
        fgChromaScaleDark
    );

    // ── Fg lightness offsets (per token, per mode) ─────────────────────────────
    const fgOffsets = (mode: "light" | "dark"): ResolvedFgOffsets => ({
        max: resolveNumber(colorTuning?.fgLightnessOffset?.max, mode, 0),
        normal: resolveNumber(colorTuning?.fgLightnessOffset?.normal, mode, 0),
        medium: resolveNumber(colorTuning?.fgLightnessOffset?.medium, mode, 0),
        disabled: resolveNumber(colorTuning?.fgLightnessOffset?.disabled, mode, 0)
    });

    // ── Border lightness offsets (per token, per mode) ─────────────────────────
    // When borderLightnessOffset is entirely absent, fall back to corresponding fg offsets:
    //   border.default → fg.normal  |  border.muted → fg.disabled  |  border.hover → fg.normal
    const borderOffsets = (mode: "light" | "dark"): ResolvedBorderOffsets => {
        const fg = fgOffsets(mode);
        const bo = colorTuning?.borderLightnessOffset;
        const isBorderDefined = bo !== undefined;
        return {
            default: resolveNumber(bo?.default, mode, isBorderDefined ? 0 : fg.normal),
            muted: resolveNumber(bo?.muted, mode, isBorderDefined ? 0 : fg.disabled),
            hover: resolveNumber(bo?.hover, mode, isBorderDefined ? 0 : fg.normal)
        };
    };

    const fgLight = genForegroundTokens(lightBackground, fgChromaScaleLight, fgOffsets("light"));
    const fgDark = genForegroundTokens(darkBackground, fgChromaScaleDark, fgOffsets("dark"));

    const borderLight = genBorderTokens(
        lightBackground,
        borderChromaScaleLight,
        borderOffsets("light")
    );
    const borderDark = genBorderTokens(
        darkBackground,
        borderChromaScaleDark,
        borderOffsets("dark")
    );

    return defineSemanticTokens.colors({
        primary: {
            DEFAULT: {
                value:
                    typeof primaryColor === "string"
                        ? primaryColor
                        : {
                              _light: primaryColor.light,
                              _dark: primaryColor.dark
                          }
            },
            fg: {
                value:
                    typeof buttonPrimaryTextColor === "string"
                        ? buttonPrimaryTextColor
                        : {
                              _light: buttonPrimaryTextColor.light,
                              _dark: buttonPrimaryTextColor.dark
                          }
            },
            hover: {
                value:
                    typeof primaryColor === "string"
                        ? `color-mix(in srgb, ${primaryColor}, currentColor 10%)`
                        : {
                              _light: `color-mix(in srgb, ${primaryColor.light}, currentColor 10%)`,
                              _dark: `color-mix(in srgb, ${primaryColor.dark}, currentColor 10%)`
                          }
            },
            active: {
                value:
                    typeof primaryColor === "string"
                        ? `color-mix(in srgb, ${primaryColor}, currentColor 20%)`
                        : {
                              _light: `color-mix(in srgb, ${primaryColor.light}, currentColor 20%)`,
                              _dark: `color-mix(in srgb, ${primaryColor.dark}, currentColor 20%)`
                          }
            }
        },
        secondary: {
            DEFAULT: {
                value:
                    typeof secondaryColor === "string"
                        ? secondaryColor
                        : {
                              _light: secondaryColor.light,
                              _dark: secondaryColor.dark
                          }
            },
            fg: {
                value:
                    typeof buttonSecondaryTextColor === "string"
                        ? buttonSecondaryTextColor
                        : {
                              _light: buttonSecondaryTextColor.light,
                              _dark: buttonSecondaryTextColor.dark
                          }
            },
            hover: {
                value:
                    typeof secondaryColor === "string"
                        ? `color-mix(in srgb, ${secondaryColor}, currentColor 10%)`
                        : {
                              _light: `color-mix(in srgb, ${secondaryColor.light}, currentColor 10%)`,
                              _dark: `color-mix(in srgb, ${secondaryColor.dark}, currentColor 10%)`
                          }
            },
            active: {
                value:
                    typeof secondaryColor === "string"
                        ? `color-mix(in srgb, ${secondaryColor}, currentColor 20%)`
                        : {
                              _light: `color-mix(in srgb, ${secondaryColor.light}, currentColor 20%)`,
                              _dark: `color-mix(in srgb, ${secondaryColor.dark}, currentColor 20%)`
                          }
            }
        },
        bg: {
            DEFAULT: {
                value: {
                    base: lightBackground,
                    _light: lightBackground,
                    _dark: darkBackground
                }
            },
            light: {
                value: lightBackground
            },
            dark: {
                value: darkBackground
            },
            panel: {
                value: {
                    // light background with 85% opacity
                    // base: `color-mix(in srgb, ${lightBackground} 85%, transparent 15%)`,
                    base: lightBackground,
                    // dark background with white alpha, to whiten the background and also alphied
                    // _dark: `color-mix(in srgb, ${darkBackground} 85%, {colors.whiteAlpha.200} 20%)`
                    _dark: alpha(darkBackground, 0.8)
                }
            }
        },
        fg: {
            DEFAULT: {
                value: {
                    _light: fgLight.normal,
                    _dark: fgDark.normal
                }
            },
            max: {
                value: {
                    _light: fgLight.max,
                    _dark: fgDark.max
                }
            },
            medium: {
                value: {
                    _light: fgLight.medium,
                    _dark: fgDark.medium
                }
            },
            disabled: {
                value: {
                    _light: fgLight.disabled,
                    _dark: fgDark.disabled
                }
            }
        },
        success: {
            DEFAULT: {
                value: {
                    _light: "{colors.green.600}",
                    _dark: "{colors.green.400}"
                }
            },
            fg: {
                value: "black/87"
            }
        },
        warning: {
            DEFAULT: {
                value: {
                    _light: "{colors.yellow.500}",
                    _dark: "{colors.yellow.400}"
                }
            },
            fg: {
                value: "black/87"
            }
        },
        error: {
            DEFAULT: {
                value: {
                    _light: "#d60b3e",
                    _dark: "#db6371"
                }
            },
            fg: {
                value: "white/87"
            }
        },
        info: {
            DEFAULT: {
                value: {
                    _light: "{colors.blue.500}",
                    _dark: "{colors.blue.400}"
                }
            },
            fg: {
                value: "black/87"
            }
        },
        border: {
            DEFAULT: {
                value: {
                    _light: borderLight.default,
                    _dark: borderDark.default
                }
            },
            muted: {
                value: {
                    _light: borderLight.muted,
                    _dark: borderDark.muted
                }
            },
            hover: {
                value: {
                    _light: borderLight.hover,
                    _dark: borderDark.hover
                }
            }
        },
        alpha: {
            50: {
                value: {
                    _light: "{colors.blackAlpha.50}",
                    _dark: "{colors.whiteAlpha.50}"
                }
            },
            100: {
                value: {
                    _light: "{colors.blackAlpha.100}",
                    _dark: "{colors.whiteAlpha.100}"
                }
            },
            200: {
                value: {
                    _light: "{colors.blackAlpha.200}",
                    _dark: "{colors.whiteAlpha.200}"
                }
            },
            300: {
                value: {
                    _light: "{colors.blackAlpha.300}",
                    _dark: "{colors.whiteAlpha.300}"
                }
            },
            400: {
                value: {
                    _light: "{colors.blackAlpha.400}",
                    _dark: "{colors.whiteAlpha.400}"
                }
            },
            500: {
                value: {
                    _light: "{colors.blackAlpha.500}",
                    _dark: "{colors.whiteAlpha.500}"
                }
            },
            600: {
                value: {
                    _light: "{colors.blackAlpha.600}",
                    _dark: "{colors.whiteAlpha.600}"
                }
            },
            700: {
                value: {
                    _light: "{colors.blackAlpha.700}",
                    _dark: "{colors.whiteAlpha.700}"
                }
            },
            800: {
                value: {
                    _light: "{colors.blackAlpha.800}",
                    _dark: "{colors.whiteAlpha.800}"
                }
            },
            900: {
                value: {
                    _light: "{colors.blackAlpha.900}",
                    _dark: "{colors.whiteAlpha.900}"
                }
            },
            950: {
                value: {
                    _light: "{colors.blackAlpha.950}",
                    _dark: "{colors.whiteAlpha.950}"
                }
            }
        },
        inverted: {
            value: {
                _light: "{colors.bg.dark}",
                _dark: "{colors.bg.light}"
            }
        }
    });
}
