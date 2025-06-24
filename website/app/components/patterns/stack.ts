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
		align: {
			type: "enum",
			value: ["start", "center", "end", "stretch"]
		},
		justify: {
			type: "enum",
			value: ["start", "center", "end", "between", "around", "evenly"]
		}
	},
	transform(props) {
		const { direction = "vertical", gap, align, justify, ...rest } = props;

		const alignItemsMap = {
			start: "flex-start",
			center: "center",
			end: "flex-end",
			stretch: "stretch"
		} as const;

		const justifyContentMap = {
			start: "flex-start",
			center: "center",
			end: "flex-end",
			between: "space-between",
			around: "space-around",
			evenly: "space-evenly"
		} as const;

		return {
			display: "flex",
			flexDirection: direction === "horizontal" ? "row" : "column",
			alignItems: align
				? alignItemsMap[align as keyof typeof alignItemsMap]
				: undefined,
			justifyContent: justify
				? justifyContentMap[justify as keyof typeof justifyContentMap]
				: undefined,
			gap,
			...rest
		};
	}
});
