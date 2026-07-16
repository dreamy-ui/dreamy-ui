import type { SystemStyleObject } from "@pandacss/dev";

const schemeNames = [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
] as const;

type SchemeName = (typeof schemeNames)[number];
type ColorSchemes = Record<SchemeName, string>;

const schemes: ColorSchemes = {
    primary: "{colors.primary}",
    secondary: "{colors.secondary}",
    success: "{colors.success}",
    warning: "{colors.warning}",
    error: "{colors.error}",
    info: "{colors.info}",
    none: "{colors.fg.max}"
};

export function getColorSchemes<T extends string>(
    cssVar: string,
    schemeProps?: (scheme: SchemeName) => SystemStyleObject,
    /**
     * if it is a slot recipe, select a main slot to apply the color scheme
     */
    slot?: T,
    generateFg = false
): Record<
    SchemeName,
    T extends string ? Record<T, SystemStyleObject> : SystemStyleObject
> {
    const entries = Object.fromEntries(
        schemeNames.map((scheme) => {
            const val = slot
                ? {
                      [slot]: {
                          [cssVar]: schemes[scheme],
                          ...schemeProps?.(scheme),
                          ...(generateFg ? { [cssVar + "-fg"]: addFgToTheScheme(scheme) } : {})
                      }
                  }
                : {
                      [cssVar]: schemes[scheme],
                      ...schemeProps?.(scheme)
                  };

            return [scheme, val];
        })
    );

    return Object.assign({}, entries) as Record<
        SchemeName,
        T extends string ? Record<T, SystemStyleObject> : SystemStyleObject
    >;
}

function addFgToTheScheme(scheme: SchemeName) {
    const s = schemes[scheme];

    if (scheme !== "none") {
        return s.replace("}", ".fg}");
    }

    return "{colors.bg}";
}
