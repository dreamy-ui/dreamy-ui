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
			}
		},
		fg: {
			DEFAULT: {
				value: {
					_light: "{colors.gray.950}",
					_dark: "{colors.gray.50}"
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
					_light: "{colors.gray.600}",
					_dark: "{colors.gray.400}"
				}
			},
			disabled: {
				value: {
					_light: "{colors.gray.400}",
					_dark: "{colors.gray.500}"
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
