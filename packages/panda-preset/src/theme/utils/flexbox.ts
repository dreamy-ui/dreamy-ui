import type { UtilityConfig } from "@pandacss/types";

export const flexboxUtilities: UtilityConfig = {
	itemsStart: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				alignItems: "start"
			};
		}
	},
	itemsCenter: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				alignItems: "center"
			};
		}
	},
	itemsEnd: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				alignItems: "end"
			};
		}
	},
	itemsBaseline: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				alignItems: "baseline"
			};
		}
	},
	itemsStretch: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				alignItems: "stretch"
			};
		}
	},
	contentStart: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "start"
			};
		}
	},
	contentCenter: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "center"
			};
		}
	},
	contentEnd: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "end"
			};
		}
	},
	contentBetween: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "space-between"
			};
		}
	},
	contentAround: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "space-around"
			};
		}
	},
	contentEvenly: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "space-evenly"
			};
		}
	},
	row: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				flexDirection: "row"
			};
		}
	},
	column: {
		values: { type: "boolean" },
		shorthand: "col",
		transform: (value) => {
			if (!value) return {};
			return {
				flexDirection: "column"
			};
		}
	},
	center: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				justifyContent: "center",
				alignItems: "center"
			};
		}
	},
	wrapped: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				flexWrap: "wrap"
			};
		}
	},
	nowrap: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				flexWrap: "nowrap"
			};
		}
	},
	wrapReverse: {
		values: { type: "boolean" },
		transform: (value) => {
			if (!value) return {};
			return {
				flexWrap: "wrap-reverse"
			};
		}
	}
};
