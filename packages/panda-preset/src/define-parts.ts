import type { SystemStyleObject } from "@pandacss/types";

/**
 * Maps part names to CSS selectors for multi-part config recipes.
 * Panda CSS v2 removed `defineParts` from `@pandacss/dev`.
 */
export function defineParts<T extends Record<string, { selector: string }>>(parts: T) {
    return (config: Partial<Record<keyof T, SystemStyleObject>>): SystemStyleObject => {
        const styles: Record<string, SystemStyleObject> = {};
        for (const key of Object.keys(config) as Array<keyof T>) {
            const value = config[key];
            if (value !== undefined) {
                styles[parts[key].selector] = value;
            }
        }
        return styles as SystemStyleObject;
    };
}
