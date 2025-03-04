import { commonUtilities } from "@/theme/utils/common";
import { containerUtilities } from "@/theme/utils/container";
import { flexboxUtilities } from "@/theme/utils/flexbox";
import { typographyUtilities } from "@/theme/utils/typography";
import type { PropertyConfig, defineConfig } from "@pandacss/dev";
import type { CssProperty, LiteralUnion } from "styled-system/types";

export const utilities: ReturnType<typeof defineConfig>["utilities"] = {
    extend: {
        ...flexboxUtilities,
        ...containerUtilities,
        ...typographyUtilities,
        ...commonUtilities
    }
};

export type UtilityConfig = {
    [property in LiteralUnion<CssProperty>]?: PropertyConfig;
};
