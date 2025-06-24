import { definePattern } from "@pandacss/dev";

export const vstack = definePattern({
	jsx: ["VStack"],
	properties: {
		justify: { type: "property", value: "justifyContent" },
		gap: { type: "property", value: "gap" }
	},
	defaultValues: {
		gap: "10px"
	},
	transform(props) {
		const { justify, gap, ...rest } = props;
		return {
			display: "flex",
			alignItems: "center",
			justifyContent: justify,
			gap,
			flexDirection: "column",
			...rest
		};
	}
});
