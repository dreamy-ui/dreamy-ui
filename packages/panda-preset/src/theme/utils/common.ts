import type { UtilityConfig } from "@pandacss/types";

export const commonUtilities: UtilityConfig = {
	// spacing: {
	//     shorthand: "space"
	// },
	// aspect ratios
	square: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				aspectRatio: "1 / 1"
			};
		}
	},
	standard: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				aspectRatio: "4 / 3"
			};
		}
	},
	video: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				aspectRatio: "16 / 9"
			};
		}
	},
	ultrawide: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				aspectRatio: "21 / 9"
			};
		}
	}
};
