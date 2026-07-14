import { definePattern } from "@pandacss/dev";

export const flex = definePattern({
    jsx: ["Flex", "Group"],
    properties: {
        align: { type: "property", value: "alignItems" },
        justify: { type: "property", value: "justifyContent" },
        direction: { type: "property", value: "flexDirection" },
        wrap: { type: "property", value: "flexWrap" },
        basis: { type: "property", value: "flexBasis" },
        grow: { type: "property", value: "flexGrow" },
        shrink: { type: "property", value: "flexShrink" }
    },
    transform(props) {
        const { direction, align, justify, wrap, basis, grow, shrink, ...rest } = props;
        return {
            display: "flex",
            flexDirection: direction,
            alignItems: align,
            justifyContent: justify,
            flexWrap: wrap,
            flexBasis: basis,
            flexGrow: grow,
            flexShrink: shrink,
            ...rest
        };
    }
});
