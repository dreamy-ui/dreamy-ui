import { definePattern } from "@pandacss/dev";

export const vstack = definePattern({
    jsx: ["VStack"],
    properties: {
        justify: { type: "property", value: "justifyContent" },
        gap: { type: "property", value: "gap" },
        align: { type: "property", value: "alignItems" }
    },
    defaultValues: {
        gap: "8px",
        align: "start"
    },
    transform(props) {
        const { justify, gap, align, ...rest } = props;
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: align,
            justifyContent: justify,
            gap,
            ...rest
        };
    }
});
