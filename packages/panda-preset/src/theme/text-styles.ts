import { defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
    xs: { value: { fontSize: "xs", lineHeight: "1.125rem" } },
    sm: {
        value: {
            fontSize: "sm",
            lineHeight: "1.25rem"
        }
    },
    md: {
        value: {
            fontSize: {
                base: "sm",
                md: "md"
            },
            lineHeight: "1.5rem"
        }
    },
    lg: {
        value: {
            fontSize: {
                base: "md",
                md: "lg"
            },
            lineHeight: "1.75rem"
        }
    },
    xl: {
        value: {
            fontSize: {
                base: "lg",
                md: "xl"
            },
            lineHeight: "1.875rem"
        }
    },
    "2xl": {
        value: {
            fontSize: {
                base: "xl",
                md: "2xl"
            },
            lineHeight: "2rem"
        }
    },
    "3xl": {
        value: {
            fontSize: {
                base: "2xl",
                md: "3xl"
            },
            lineHeight: "2.375rem"
        }
    },
    "4xl": {
        value: {
            fontSize: {
                base: "3xl",
                md: "4xl"
            },
            lineHeight: "2.75rem",
            letterSpacing: "-0.02em"
        }
    },
    "5xl": {
        value: {
            fontSize: {
                base: "4xl",
                md: "5xl"
            },
            lineHeight: "3.75rem",
            letterSpacing: "-0.02em"
        }
    },
    "6xl": {
        value: {
            fontSize: {
                base: "5xl",
                md: "6xl"
            },
            lineHeight: "4.5rem",
            letterSpacing: "-0.02em"
        }
    },
    "7xl": {
        value: {
            fontSize: {
                base: "6xl",
                md: "7xl"
            },
            lineHeight: "5.75rem",
            letterSpacing: "-0.02em"
        }
    }
});
