import type { UtilityConfig } from "@/theme/utils";

export const containerUtilities: UtilityConfig = {
    // values
    boxSize: {
        values: "spacing",
        transform: (value) => {
            return {
                width: value,
                height: value
            };
        }
    },

    // booleans
    block: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "block"
            };
        }
    },
    inline: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "inline"
            };
        }
    },
    inlineBlock: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "inline-block"
            };
        }
    },
    flexbox: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "flex"
            };
        }
    },
    grid: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "grid"
            };
        }
    },
    flow: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "flow"
            };
        }
    },
    flowRoot: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                display: "flow-root"
            };
        }
    },
    border: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                borderWidth: "1px",
                borderStyle: "solid"
                // borderColor: "{colors.alpha.300}"
            };
        }
    },
    full: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "100%",
                height: "100%"
            };
        }
    },
    wFull: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "100%"
            };
        }
    },
    wHalf: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "50%"
            };
        }
    },
    wAuto: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "auto"
            };
        }
    },

    hFull: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                height: "100%"
            };
        }
    },
    hHalf: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                height: "50%"
            };
        }
    },
    hAuto: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                height: "auto"
            };
        }
    }
};
