import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
    "spinner-spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" }
    },
    "progress-spin": {
        "0%": {
            strokeDasharray: "1, 400",
            strokeDashoffset: "0"
        },
        "50%": {
            strokeDasharray: "400, 400",
            strokeDashoffset: "-100"
        },
        "100%": {
            strokeDasharray: "400, 400",
            strokeDashoffset: "-260"
        }
    },
    "progress-rotate": {
        "0%": {
            transform: "rotate(0deg)"
        },
        "100%": {
            transform: "rotate(360deg)"
        }
    },
    progress: {
        "0%": { left: "-100%" },
        "100%": { left: "100%" }
    },
    stripe: {
        from: { backgroundPosition: "1rem 0" },
        to: { backgroundPosition: "0 0" }
    }
});
