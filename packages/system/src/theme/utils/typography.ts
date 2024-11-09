import type { UtilityConfig } from "@/theme/utils";

export const typographyUtilities: UtilityConfig = {
    textCenter: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textAlign: "center"
            };
        }
    },
    textLeft: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textAlign: "left"
            };
        }
    },
    textRight: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textAlign: "right"
            };
        }
    },
    textJustify: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textAlign: "justify"
            };
        }
    },
    textNowrap: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                whiteSpace: "nowrap"
            };
        }
    },
    textBreak: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                overflowWrap: "break-word",
                wordWrap: "break-word"
            };
        }
    },
    uppercase: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textTransform: "uppercase"
            };
        }
    },
    lowercase: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textTransform: "lowercase"
            };
        }
    },
    capitalize: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textTransform: "capitalize"
            };
        }
    },
    italic: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontStyle: "italic"
            };
        }
    },
    notItalic: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontStyle: "normal"
            };
        }
    },
    underline: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textDecoration: "underline"
            };
        }
    },
    lineThrough: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textDecoration: "line-through"
            };
        }
    },
    noUnderline: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textDecoration: "none"
            };
        }
    },
    normalCase: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textTransform: "none"
            };
        }
    },
    truncate: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            };
        }
    },
    bold: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontWeight: "bold"
            };
        }
    },
    semibold: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontWeight: "semibold"
            };
        }
    },
    medium: {
        values: { type: "boolean" },
        shorthand: "normal",
        transform: (value) => {
            if (!value) return {};
            return {
                fontWeight: "normal"
            };
        }
    },
    light: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontWeight: "light"
            };
        }
    },
    lighter: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                fontWeight: "lighter"
            };
        }
    }
};
