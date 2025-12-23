import { definePattern } from "@pandacss/dev";

export const text = definePattern({
	jsx: ["Heading", "Text"],
	properties: {
		variant: {
			type: "enum",
			value: ["heading", "link"]
		},
		size: {
			type: "enum",
			value: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"]
		}
	},
	transform(props, { map }) {
		const { variant, size, ...rest } = props;
		return {
			textStyle: size ?? map(variant, (v) => (v === "heading" ? "xl" : undefined)),
			fontWeight: map(variant, (v) =>
				v === "heading" ? "bold" : v === "link" ? "semibold" : undefined
			),
			fontFamily: map(variant, (v) => (v === "heading" ? "heading" : undefined)),
			transition: map(variant, (v) => (v === "link" ? "colors" : undefined)),
			_hover: map(variant, (v) =>
				v === "link" ? ({ color: "{colors.fg.max}" } as any) : undefined
			),
			...rest
		};
	}
});
