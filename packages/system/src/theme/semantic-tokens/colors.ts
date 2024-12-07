import type { PresetOptions } from "@/theme/preset";
import { defineSemanticTokens } from "@pandacss/dev";

export function createColorTokens({
    backgrounds: { light: lightBackground, dark: darkBackground },
    primaryColor,
    secondaryColor,
    buttonPrimaryTextColor,
    buttonSecondaryTextColor
}: PresetOptions) {
    return defineSemanticTokens.colors({
        primary: {
            value: primaryColor
        },
        secondary: {
            value: secondaryColor
        },
        primaryButtonText: {
            value: buttonPrimaryTextColor
        },
        secondaryButtonText: {
            value: buttonSecondaryTextColor
        },
        bg: {
            DEFAULT: {
                value: { base: lightBackground, _dark: darkBackground }
            },
            light: {
                value: lightBackground
            },
            dark: {
                value: darkBackground
            }
        },
        fg: {
            DEFAULT: {
                value: {
                    _light: "{colors.black/87}",
                    _dark: "{colors.white/87}"
                }
            },
            max: {
                value: {
                    _light: "{colors.black}",
                    _dark: "{colors.white}"
                }
            },
            medium: {
                value: {
                    _light: "#1b1b1f/60",
                    _dark: "#e9eeff/60"
                }
            },
            disabled: {
                value: {
                    _light: "#1b1b1f/38",
                    _dark: "#e9eeff/38"
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
            default: { value: "{colors.alpha.300}" },
            muted: { value: "{colors.alpha.150}" },
            hover: { value: "{colors.alpha.200}" }
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
            150: {
                value: {
                    _light: "{colors.blackAlpha.150}",
                    _dark: "{colors.whiteAlpha.150}"
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
