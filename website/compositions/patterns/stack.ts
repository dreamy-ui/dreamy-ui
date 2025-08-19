import { definePattern } from "@pandacss/dev";

export const stack = definePattern({
	jsx: ["Stack"],
	description: "A pattern for stacking elements with consistent spacing",
	properties: {
		direction: {
			type: "enum",
			value: ["horizontal", "vertical"]
		},
		gap: { type: "property", value: "gap" },
		align: { type: "property", value: "alignItems" },
		justify: { type: "property", value: "justifyContent" }
	},
	defaultValues: {
		gap: "10px",
		align: "center",
		direction: "vertical"
	},
	transform(props) {
		const { direction, gap, align, justify, ...rest } = props;

		return {
			display: "flex",
			flexDirection: direction === "horizontal" ? "row" : "column",
			alignItems: align,
			justifyContent: justify,
			gap,
			...rest
		};
	}
});
