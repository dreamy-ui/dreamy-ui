import { definePattern } from "@pandacss/dev";

export const wrap = definePattern({
	properties: {
		gap: { type: "property", value: "gap" },
		rowGap: { type: "property", value: "gap" },
		columnGap: { type: "property", value: "gap" },
		align: { type: "property", value: "alignItems" },
		justify: { type: "property", value: "justifyContent" }
	},
	transform(props) {
		const {
			columnGap,
			rowGap,
			gap = columnGap || rowGap ? undefined : "10px",
			align,
			justify,
			...rest
		} = props;
		return {
			display: "flex",
			flexWrap: "wrap",
			alignItems: align,
			justifyContent: justify,
			gap,
			columnGap,
			rowGap,
			...rest
		};
	}
});
