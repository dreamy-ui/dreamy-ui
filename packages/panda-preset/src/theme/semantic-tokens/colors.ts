import { getPresetOptions } from "@/theme/preset";
import { defineSemanticTokens } from "@pandacss/dev";
import { alpha, genForegroundTokens } from "../colors";

export function createColorTokens() {
    const {
        backgrounds: { light: lightBackground, dark: darkBackground },
        primaryColor,
        secondaryColor,
        buttonPrimaryTextColor,
        buttonSecondaryTextColor
    } = getPresetOptions();

    const fgLight = genForegroundTokens(lightBackground);
    const fgDark = genForegroundTokens(darkBackground);

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
            }
        },
        primaryButtonText: {
            value:
                typeof buttonPrimaryTextColor === "string"
                    ? buttonPrimaryTextColor
                    : {
                          _light: buttonPrimaryTextColor.light,
                          _dark: buttonPrimaryTextColor.dark
                      }
        },
        secondaryButtonText: {
            value:
                typeof buttonSecondaryTextColor === "string"
                    ? buttonSecondaryTextColor
                    : {
                          _light: buttonSecondaryTextColor.light,
                          _dark: buttonSecondaryTextColor.dark
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
            value: {
                _light: "{colors.green.600}",
                _dark: "{colors.green.400}"
            }
        },
        warning: {
            value: {
                _light: "{colors.yellow.500}",
                _dark: "{colors.yellow.400}"
            }
        },
        error: {
            value: {
                _light: "#d60b3e",
                _dark: "#db6371"
            }
        },
        info: {
            value: {
                _light: "{colors.blue.500}",
                _dark: "{colors.blue.400}"
            }
        },
        border: {
            DEFAULT: {
                value: "{colors.alpha.300}"
            },
            muted: {
                value: "{colors.alpha.200}"
            },
            hover: {
                value: "{colors.alpha.400}"
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
                _light: "{colors.fg.max}",
                _dark: "{colors.bg}"
            }
        }
    });
}
