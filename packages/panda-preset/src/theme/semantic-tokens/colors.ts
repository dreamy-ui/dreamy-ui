import { getPresetOptions } from "@/theme/preset";
import { defineSemanticTokens } from "@pandacss/dev";
import {
    type ResolvedBorderOffsets,
    type ResolvedFgOffsets,
    genBackgroundSurfaceTokens,
    genBorderTokens,
    genForegroundTokens,
    resolveModeNumber
} from "../colors";

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
    const fgChromaScaleLight = resolveModeNumber(colorTuning?.fg?.chroma, "light", 1);
    const fgChromaScaleDark = resolveModeNumber(colorTuning?.fg?.chroma, "dark", 1);

    const borderChromaScaleLight = resolveModeNumber(
        colorTuning?.border?.chroma,
        "light",
        fgChromaScaleLight
    );
    const borderChromaScaleDark = resolveModeNumber(
        colorTuning?.border?.chroma,
        "dark",
        fgChromaScaleDark
    );

    // ── Fg lightness offsets (per token, per mode) ─────────────────────────────
    const fgOffsets = (mode: "light" | "dark"): ResolvedFgOffsets => ({
        max: resolveModeNumber(colorTuning?.fg?.lightness?.max, mode, 0),
        normal: resolveModeNumber(colorTuning?.fg?.lightness?.normal, mode, 0),
        medium: resolveModeNumber(colorTuning?.fg?.lightness?.medium, mode, 0),
        disabled: resolveModeNumber(colorTuning?.fg?.lightness?.disabled, mode, 0)
    });

    // ── Border lightness offsets (per token, per mode) ─────────────────────────
    // When border.lightness is entirely absent, fall back to corresponding fg offsets:
    //   border.default → fg.normal  |  border.muted → fg.disabled  |  border.hover → fg.normal
    const borderOffsets = (mode: "light" | "dark"): ResolvedBorderOffsets => {
        const fg = fgOffsets(mode);
        const borderLightness = colorTuning?.border?.lightness;
        const isBorderDefined = borderLightness !== undefined;
        return {
            default: resolveModeNumber(borderLightness?.default, mode, isBorderDefined ? 0 : fg.normal),
            muted: resolveModeNumber(borderLightness?.muted, mode, isBorderDefined ? 0 : fg.disabled),
            hover: resolveModeNumber(borderLightness?.hover, mode, isBorderDefined ? 0 : fg.normal)
        };
    };

    const fgLight = genForegroundTokens(lightBackground, fgChromaScaleLight, fgOffsets("light"));
    const fgDark = genForegroundTokens(darkBackground, fgChromaScaleDark, fgOffsets("dark"));
    const bgSurfaces = genBackgroundSurfaceTokens(lightBackground, darkBackground);

    // const borderLight = genBorderTokens(
    //     lightBackground,
    //     borderChromaScaleLight,
    //     borderOffsets("light")
    // );
    // const borderDark = genBorderTokens(
    //     darkBackground,
    //     borderChromaScaleDark,
    //     borderOffsets("dark")
    // );

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
                    base: bgSurfaces.light.panel,
                    _light: bgSurfaces.light.panel,
                    _dark: bgSurfaces.dark.panel
                }
            },
            subtle: {
                value: {
                    _light: bgSurfaces.light.subtle,
                    _dark: bgSurfaces.dark.subtle
                }
            },
            muted: {
                value: {
                    _light: bgSurfaces.light.muted,
                    _dark: bgSurfaces.dark.muted
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
                    _light: '{colors.alpha.200}',
                    _dark: '{colors.alpha.200}'
                }
            },
            muted: {
                value: {
                    _light: '{colors.alpha.50}',
                    _dark: '{colors.alpha.50}'
                }
            },
            hover: {
                value: {
                    _light: '{colors.alpha.300}',
                    _dark: '{colors.alpha.300}'
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
