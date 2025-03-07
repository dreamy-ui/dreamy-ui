import { commonUtilities } from "@/theme/utils/common";
import { containerUtilities } from "@/theme/utils/container";
import { flexboxUtilities } from "@/theme/utils/flexbox";
import { typographyUtilities } from "@/theme/utils/typography";
import type { defineConfig } from "@pandacss/dev";

export const utilities: ReturnType<typeof defineConfig>["utilities"] = {
	extend: {
		...flexboxUtilities,
		...containerUtilities,
		...typographyUtilities,
		...commonUtilities
	}
};
