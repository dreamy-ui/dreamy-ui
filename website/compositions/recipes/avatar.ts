import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: {
		selector: "&"
	},
	image: { selector: '& [data-part="image"]' },
	name: { selector: '& [data-part="name"]' },
	group: { selector: '[data-part="group"]:has(&)' },
	excess: { selector: '[data-part="group"]:has(&) [data-part="excess"]' }
});

export { parts as avatarParts };

export const avatar = defineRecipe({
	className: "dreamy-avatar",
	jsx: ["Avatar", "AvatarImage", "AvatarName"],
	base: parts({
		root: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: "full",
			overflow: "hidden"
			// transition: "transform 0.2s {easings.ease-in-out}",
			// _hover: {
			//     '[data-part="group"]:has(&) &': {
			//         transform: "translateX(-0.75rem)"
			//     }
			// }
		},
		name: {
			fontWeight: "500",
			fontSize: "md"
		},
		image: {
			objectFit: "cover",
			objectPosition: "center",
			width: "100%",
			height: "100%",
			rounded: "inherit"
		},
		group: {
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-end",
			flexDirection: "row-reverse"
		},
		excess: {
			bg: "{colors.alpha.100}",
			backdropFilter: "blur({blurs.md})",
			fontWeight: "500",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			rounded: "full"
		}
	}),
	defaultVariants: {
		size: "md"
	},
	variants: {
		size: {
			sm: parts({
				root: {
					width: "8",
					height: "8"
				},
				excess: {
					width: "8",
					height: "8"
				}
			}),
			md: parts({
				root: {
					width: "10",
					height: "10"
				},
				excess: {
					width: "10",
					height: "10"
				}
			}),
			lg: parts({
				root: {
					width: "12",
					height: "12"
				},
				excess: {
					width: "12",
					height: "12"
				}
			})
		},
		showBorder: {
			true: parts({
				root: {
					borderWidth: "2px",
					borderStyle: "solid",
					borderColor: "{colors.bg}"
				}
			})
		}
	}
});
