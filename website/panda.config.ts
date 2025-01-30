import { createDreamyPreset } from "@dreamy-ui/system";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";

export default defineConfig({
	preflight: true,
	watch: true,
	jsxFramework: "react",
	jsxStyleProps: "all",
	outExtension: "js",
	include: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./docs/**/*.{md,mdx}",
		"../packages/react/dist/**/*.{js,jsx,ts,tsx}",
		"../packages/system/styled-system/**/*.{js,jsx,ts,tsx}",
		"../packages/system/dist/**/*.{js,jsx,ts,tsx}" // The preset location
	],
	importMap: "@dreamy-ui/system",
	exclude: [],
	presets: [
		pandaPreset,
		createDreamyPreset({
			backgrounds: {
				// dark: "#000",
				dark: "#080808",
				light: "#FCF9FD"
			},
			fonts: {
				body: "Geist",
				heading: "Manrope"
			},
			primaryColor: "#6056aa",
			secondaryColor: "#d193bb",
			rounded: "lg"
		})
	],
	theme: {
		extend: {
			semanticTokens: {
				colors: {
					tertiary: {
						value: "#fbb36a"
					}
				}
			},
			keyframes: {
				downUp: {
					"0%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(20px)" },
					"100%": { transform: "translateY(0)" }
				}
			}
		}
	},
	globalCss: {
		extend: {
			"*": {
				scrollPaddingTop: 24
			},
			html: {
				scrollBehavior: "smooth"
			},
			body: {
				overflowY: "scroll"
			},
			pre: {
				overflowX: "auto",
				padding: "1rem 0",
				borderRadius: "0.5rem",
				width: "100%",
				fontSize: "sm"
			},
			"pre [data-line]": {
				padding: "0 1rem",
				width: "fit-content"
			},
			"figure[data-rehype-pretty-code-figure]": {
				// it was breaking on mobile with 100%
				width: "100%",
				maxWidth: "100%",
				overflowX: "auto",
				margin: "auto",
				marginTop: 4,
				marginBottom: 4
			},
			"code span[data-line]": {
				width: "full"
			},
			"span[data-rehype-pretty-code-figure]": {
				fontSize: "small",
				marginInline: "0.1rem",
				"& code": {
					background: "{colors.secondary}/20 !important",
					paddingX: "0.4rem",
					paddingY: "0.2rem",
					rounded: "sm",
					"& span > span": {
						color: "{colors.secondary} !important"
					}
				}
			},
			"span[data-highlighted-line]": {
				bg: "linear-gradient(to right, {colors.success/12}, transparent)"
			},
			li: {
				_marker: {
					color: {
						base: "rgba(0, 0, 0, 0.67)",
						_dark: "rgba(255, 255, 255, 0.67)"
					}
				}
			}
		}
	},
	staticCss: {
		extend: {
			recipes: "*",
			// css for docs, since panda does not extract css from mdx
			css: [
				{
					properties: {
						animationDelay: ["0s", "0.5s", "1s", "1.5s", "2s"],
						minW: [20],
						maxW: ["300px"],
						bg: ["secondary", "blue.400", "purple.400"],
						color: ["white"],
						fontWeight: [500],
						p: [3, 2],
						justifyContent: ["between"],
						rounded: ["md", "inherit"],
						w: ["250px", "100px", "1/3", "auto", "xs", "sm"],
						h: ["100px"],
						resize: ["none", "vertical", "horizontal", "both"],
						position: ["absolute", "relative"],
						top: [0, "50%"],
						left: [0],
						right: [0],
						bottom: [0],
						overflow: ["hidden"],
						flex: [1, "0 0 auto"],
						pos: ["relative"],
						opacity: [0],
						op: [0],
						display: ["flex"],
						alignItems: ["center"],
						lineHeight: ["normal"],
						whiteSpace: ["nowrap"],
						transform: ["translateY(-50%)"],
						marginEnd: ["-0.75rem"],
						marginStart: ["-0.75rem"],
						visibility: ["visible", "hidden"],
						gap: [6]
					}
				}
			]
		}
	}
});
