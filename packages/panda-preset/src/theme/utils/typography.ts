import type { UtilityConfig } from "@pandacss/types";

export const typographyUtilities: UtilityConfig = {
    leading: {
        values: "lineHeights",
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                lineHeight: token("lineHeights." + value)
            };
        }
    },
    tracking: {
        values: "letterSpacings",
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                letterSpacing: token("letterSpacings." + value)
            };
        }
    },
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
    black: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.black")
            };
        }
    },
    extrabold: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.extrabold")
            };
        }
    },
    bold: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.bold")
            };
        }
    },
    semibold: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.semibold")
            };
        }
    },
    medium: {
        values: { type: "boolean" },
        shorthand: "normal",
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.normal")
            };
        }
    },
    normal: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.normal")
            };
        }
    },
    light: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.light")
            };
        }
    },
    lighter: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.extralight")
            };
        }
    },
    thin: {
        values: { type: "boolean" },
        transform: (value, { token }) => {
            if (!value) return {};
            return {
                fontWeight: token("fontWeights.thin")
            };
        }
    },
    fg: {
        values: "colors",
        transform: (value) => {
            if (!value) return {};
            return {
                color: value
            };
        }
    },
    trimText: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                textBoxEdge: "cap alphabetic",
                textBoxTrim: "trim-both"
            };
        }
    }
};
