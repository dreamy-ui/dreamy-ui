import { definePattern } from "@pandacss/dev";

export const divider = definePattern({
	jsx: ["Divider"],
	properties: {
		orientation: { type: "enum", value: ["horizontal", "vertical"] },
		thickness: { type: "token", value: "sizes", property: "borderWidth" },
		color: { type: "token", value: "colors", property: "borderColor" }
	},
	defaultValues: {
		orientation: "horizontal",
		thickness: "1px"
	},
	transform(props, { map }) {
		const {
			orientation,
			thickness,
			color,
			backgroundColor,
			background,
			bg,
			borderColor,
			...rest
		} = props;
		return {
			"--thickness": thickness,
			width: map(orientation, (v) => (v === "vertical" ? undefined : "100%")),
			height: map(orientation, (v) => (v === "horizontal" ? undefined : "100%")),
			border: "none",
			borderTop: map(orientation, (v) =>
				v === "horizontal" ? "var(--thickness)" : undefined
			),
			borderLeft: map(orientation, (v) =>
				v === "vertical" ? "var(--thickness)" : undefined
			),
			borderColor: color ?? backgroundColor ?? background ?? bg ?? borderColor ?? "border",
			...rest
		};
	}
});
