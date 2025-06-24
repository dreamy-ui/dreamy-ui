import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: { selector: "&" },
	icon: { selector: "& [data-part='icon']" },
	title: { selector: "& [data-part='title']" },
	description: { selector: "& [data-part='description']" }
});

export const alert = defineRecipe({
	className: "dreamy-alert",
	description: "Dreamy UI Alert component",
	jsx: ["Alert"],
	base: parts({
		root: {
			display: "flex",
			flexDirection: "column",
			paddingX: 4,
			paddingY: 3,
			borderRadius: "l2",
			fontSize: "md",
			width: "100%",
			gap: 0.5
		},
		title: {
			display: "flex",
			alignItems: "center",
			fontWeight: "semibold",
			fontSize: "md",
			textWrap: "wrap"
		},
		description: {
			ml: 7
		},
		icon: {
			width: "5",
			height: "5",
			mr: 2,
			flexShrink: 0,
			"[data-status=success]&": {
				color: "{colors.success}",
				fill: "{colors.success}",
				stroke: "{colors.success}"
			},
			"[data-status=warning]&": {
				color: "{colors.warning}",
				fill: "{colors.warning}"
			},
			"[data-status=error]&": {
				color: "{colors.error}",
				fill: "{colors.error}"
			},
			"[data-status=info]&": {
				color: "{colors.info}",
				fill: "{colors.info}",
				stroke: "{colors.info}"
			}
		}
	}),
	variants: {
		variant: {
			subtle: parts({
				root: {
					"&[data-status=success]": {
						bg: "{colors.success}/10"
					},
					"&[data-status=warning]": {
						bg: "{colors.warning}/10"
					},
					"&[data-status=error]": {
						bg: "{colors.error}/10"
					},
					"&[data-status=info]": {
						bg: "{colors.info}/10"
					}
				}
			}),
			outline: parts({
				root: {
					borderWidth: 1,
					borderStyle: "solid",
					"&[data-status=success]": {
						borderColor: "{colors.success}"
					},
					"&[data-status=warning]": {
						borderColor: "{colors.warning}"
					},
					"&[data-status=error]": {
						borderColor: "{colors.error}"
					},
					"&[data-status=info]": {
						borderColor: "{colors.info}"
					}
				}
			})
		}
	},
	defaultVariants: {
		variant: "subtle"
	}
});
