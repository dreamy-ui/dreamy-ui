import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts({
	root: { selector: "&" },
	icon: { selector: "& [data-part='icon']" },
	title: { selector: "& [data-part='title']" },
	description: { selector: "& [data-part='description']" },
	container: { selector: "& [data-part='container']" },
	close: { selector: "& [data-part='close']" }
});

export const toast = defineRecipe({
	className: "dreamy-toast",
	description: "Dreamy UI Toast component",
	staticCss: ["*"], // Adding staticCSS, since toast be cannot used as normal JSX component
	jsx: ["Toast"],
	base: parts({
		root: {
			w: "fit-content",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			paddingX: 4,
			paddingY: 3,
			borderRadius: "l2",
			gap: 2,
			boxShadow: "md",
			zIndex: "toast",
			pointerEvents: "auto",
			"[data-variant='default']&": {
				bg: "color-mix(in srgb, {colors.bg} 70%, {colors.alpha.100} 10%)",
				backdropFilter: "blur({blurs.base})",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "border.muted"
			}
		},
		container: {
			display: "flex",
			flexDirection: "column",
			gap: 0.5
		},
		title: {
			fontWeight: "semibold",
			fontSize: "md",
			textWrap: "wrap",
			display: "flex",
			alignItems: "center",
			gap: 2
		},
		description: {
			ml: 7
		},
		icon: {
			width: "5",
			height: "5",
			flexShrink: 0,
			"[data-status='success']&": {
				color: "{colors.success}",
				fill: "{colors.success}",
				stroke: "{colors.success}"
			},
			"[data-status='warning']&": {
				color: "{colors.warning}",
				fill: "{colors.warning}"
			},
			"[data-status='error']&": {
				color: "{colors.error}",
				fill: "{colors.error}"
			},
			"[data-status='info']&": {
				color: "{colors.info}",
				fill: "{colors.info}",
				stroke: "{colors.info}"
			},
			"[data-status='loading']&": {
				color: "{colors.info}",
				fill: "{colors.info}",
				stroke: "{colors.info}"
			}
		},
		close: {
			position: "absolute",
			top: 1,
			right: 1
		}
	})
});
