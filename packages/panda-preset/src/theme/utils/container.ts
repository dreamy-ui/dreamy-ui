import type { UtilityConfig } from "@pandacss/types";

export const containerUtilities: UtilityConfig = {
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
    full: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "100%"
            };
        }
    },
    boxFull: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                width: "100%",
                height: "100%"
            };
        }
    },
    // positions
    relative: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                position: "relative"
            };
        }
    },
    absolute: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                position: "absolute"
            };
        }
    },
    fixed: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                position: "fixed"
            };
        }
    },
    sticky: {
        values: { type: "boolean" },
        transform: (value) => {
            if (!value) return {};
            return {
                position: "sticky"
            };
        }
    }
};
