import { z } from "zod";

export function componentIdSchema(componentIds: string[]) {
	if (componentIds.length > 0) {
		return z
			.enum(componentIds as [string, ...string[]])
			.describe("The Dreamy UI component id in kebab-case (e.g. switch, date-picker)");
	}

	return z
		.string()
		.min(1)
		.describe(
			"The Dreamy UI component id in kebab-case (e.g. switch, date-picker). Component list is currently unavailable."
		);
}
