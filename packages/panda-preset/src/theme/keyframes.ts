import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
    "spinner-spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" }
    },
    "progress-spin": {
        "0%": {
            strokeDasharray: "40px, 100px",
            strokeDashoffset: "0px"
        },
        "50%": {
            strokeDasharray: "100px, 200px",
            strokeDashoffset: "-15px"
        },
        "100%": {
            strokeDasharray: "40px, 100px",
            strokeDashoffset: "-130px"
        }
    },
    progress: {
        "0%": { left: "-100%" },
        "100%": { left: "100%" }
    },
    stripe: {
        from: { backgroundPosition: "1rem 0" },
        to: { backgroundPosition: "0 0" }
    },
    pulse: {
        "50%": { opacity: "0.5" }
    },
    "bg-position": {
        from: { backgroundPosition: "var(--animate-from, 1rem) 0" },
        to: { backgroundPosition: "var(--animate-to, 0) 0" }
    }
});
