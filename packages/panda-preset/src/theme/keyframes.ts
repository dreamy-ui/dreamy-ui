import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
	spin: {
		to: {
			transform: "rotate(360deg)"
		}
	},
	ping: {
		"75%, 100%": {
			transform: "scale(2)",
			opacity: "0"
		}
	},
	bounce: {
		"0%, 100%": {
			transform: "translateY(-25%)",
			animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
		},
		"50%": {
			transform: "none",
			animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
		}
	},
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

export const animations = {
	spin: { value: "spin 1s linear infinite" },
	ping: { value: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" },
	pulse: { value: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
	bounce: { value: "bounce 1s infinite" }
};
