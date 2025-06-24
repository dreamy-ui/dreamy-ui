import { definePattern } from "@pandacss/dev";

export const grid = definePattern({
	properties: {
		gap: { type: "property", value: "gap" },
		columnGap: { type: "property", value: "gap" },
		rowGap: { type: "property", value: "gap" },
		columns: { type: "number" },
		minChildWidth: { type: "token", value: "sizes", property: "width" }
	},
	defaultValues(props) {
		return { gap: props.columnGap || props.rowGap ? undefined : "10px" };
	},
	transform(props, { map, isCssUnit }) {
		const { columnGap, rowGap, gap, columns, minChildWidth, ...rest } =
			props;
		const getValue = (v: string) =>
			isCssUnit(v) ? v : `token(sizes.${v}, ${v})`;
		return {
			display: "grid",
			gridTemplateColumns:
				columns != null
					? map(columns, (v) => `repeat(${v}, minmax(0, 1fr))`)
					: minChildWidth != null
					? map(
							minChildWidth,
							(v) =>
								`repeat(auto-fit, minmax(${getValue(v)}, 1fr))`
					  )
					: undefined,
			gap,
			columnGap,
			rowGap,
			...rest
		};
	}
});
