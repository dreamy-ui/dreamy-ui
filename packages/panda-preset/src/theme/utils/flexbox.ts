import type { UtilityConfig } from "@pandacss/types";

export const flexboxUtilities: UtilityConfig = {
    alignItems: {
        property: "alignItems",
        shorthand: ["align", "items"],
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: value
            };
        }
    },
    justifyContent: {
        property: "justifyContent",
        shorthand: ["justify"],
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: value
            };
        }
    },
    flexDirection: {
        property: "flexDirection",
        values: ["col", "col-reverse"],
        shorthand: ["direction", "flexDir", "fDir"],
        transform: (value) => {
            if (!value) return {};
            return {
                flexDirection:
                    value === "col" ? "column" : value === "col-reverse" ? "column-reverse" : value
            };
        }
    },
    flexWrap: {
        property: "flexWrap",
        shorthand: ["wrap"],
        transform: (value) => {
            if (!value) return {};
            return {
                flexWrap: value
            };
        }
    },
    flexBasis: {
        property: "flexBasis",
        shorthand: ["basis"],
        transform: (value) => {
            if (!value) return {};
            return {
                flexBasis: value
            };
        }
    },
    flexGrow: {
        property: "flexGrow",
        shorthand: ["grow"],
        transform: (value) => {
            if (!value) return {};
            return {
                flexGrow: value
            };
        }
    },
    flexShrink: {
        property: "flexShrink",
        shorthand: ["shrink"],
        transform: (value) => {
            if (!value) return {};
            return {
                flexShrink: value
            };
        }
    },
    itemsStart: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: "start"
            };
        }
    },
    itemsCenter: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: "center"
            };
        }
    },
    itemsEnd: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: "end"
            };
        }
    },
    itemsBaseline: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: "baseline"
            };
        }
    },
    itemsStretch: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                alignItems: "stretch"
            };
        }
    },
    contentStart: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "start"
            };
        }
    },
    contentCenter: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "center"
            };
        }
    },
    contentEnd: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "end"
            };
        }
    },
    contentBetween: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "space-between"
            };
        }
    },
    contentAround: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "space-around"
            };
        }
    },
    contentEvenly: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "space-evenly"
            };
        }
    },
    row: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                flexDirection: "row"
            };
        }
    },
    column: {
        values: { type: "boolean" },
        shorthand: "col",
        transform: (value) => {
            if (!value) return {};
            return {
                flexDirection: "column"
            };
        }
    },
    center: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                justifyContent: "center",
                alignItems: "center"
            };
        }
    },
    wrapped: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                flexWrap: "wrap"
            };
        }
    },
    nowrap: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                flexWrap: "nowrap"
            };
        }
    },
    wrapReverse: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                flexWrap: "wrap-reverse"
            };
        }
    }
};
