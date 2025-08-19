import type { Variants } from "./types";

export const TRANSITION_EASINGS = {
	ease: [0.25, 0.1, 0.25, 1],
	easeIn: [0.4, 0, 1, 1],
	easeOut: [0.5, 0, 0.2, 1],
	easeInOut: [0.4, 0, 0.2, 1]
} as const;

export const TRANSITION_DEFAULTS = {
	enter: {
		duration: 0.2,
		ease: TRANSITION_EASINGS.easeOut
	},
	exit: {
		duration: 0.1,
		ease: TRANSITION_EASINGS.easeIn
	}
} as const;

function resetDurations(obj: any): Variants {
	// Loop through each key in the object
	for (const key in obj) {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (obj.hasOwnProperty(key)) {
			if (key === "duration" && typeof obj[key] === "number") {
				// Set the duration to 0 if the key is "duration"
				obj[key] = 0;
			} else if (typeof obj[key] === "object" && obj[key] !== null) {
				// Recursively process nested objects
				resetDurations(obj[key]);
			}
		}
	}
	return obj;
}

export function transformReducedMotion(variants: any, shouldReduceMotion: boolean) {
	if (shouldReduceMotion) {
		const variantsCopy = JSON.parse(JSON.stringify(variants));
		return resetDurations(variantsCopy);
	}
	return variants;
}
