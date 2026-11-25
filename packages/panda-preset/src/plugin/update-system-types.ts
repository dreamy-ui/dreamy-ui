import fs from "node:fs/promises";
import path from "node:path";

const PATTERN_TYPES_IMPORT_WITH_CONDITIONAL =
    "import type { ConditionalValue, SystemStyleObject } from '../types/system';\nimport type { SystemProperties } from '../types/style-props';";

const PATTERN_TYPES_IMPORT =
    "import type { SystemStyleObject } from '../types/system';\nimport type { SystemProperties } from '../types/style-props';";

const PANDA_V2_PATTERN_TYPES_IMPORT_WITH_CONDITIONAL =
    "import type { ConditionalValue, SystemProperties, SystemStyleObject } from '../types/system';";

const PANDA_V2_PATTERN_TYPES_IMPORT =
    "import type { SystemProperties, SystemStyleObject } from '../types/system';";

const LEGACY_PATTERN_TYPES_IMPORT_WITH_CONDITIONAL =
    /import type \{ ConditionalValue, SystemProperties, SystemStyleObject \} from '\.\.\/types\/system';/g;

const LEGACY_PATTERN_TYPES_IMPORT =
    /import type \{ SystemProperties, SystemStyleObject \} from '\.\.\/types\/system';/g;

const STYLE_PROPS_PLACEHOLDER_PATTERN = /\[\s*key\s*:\s*string\s*\]\s*:\s*unknown/;

export async function hasRealStyleProps(typesFolder: string): Promise<boolean> {
    try {
        const content = await fs.readFile(path.join(typesFolder, "style-props.d.ts"), "utf8");
        if (STYLE_PROPS_PLACEHOLDER_PATTERN.test(content)) {
            return false;
        }
        return content.includes("export interface SystemProperties");
    } catch {
        return false;
    }
}

/**
 * Panda v2 places all CSS properties and utility shorthands in `system.d.ts` while leaving
 * `style-props.d.ts` as a `[key: string]: unknown` placeholder; only rewrite `JsxStyleProps`
 * when `style-props.d.ts` contains real generated utility types.
 */
export async function updateJsxStyleProps(typesFolder: string) {
    const systemPath = path.join(typesFolder, "system.d.ts");
    let content = await fs.readFile(systemPath, "utf8");

    if (!(await hasRealStyleProps(typesFolder))) {
        let updated = content.replace(
            "import type { SystemProperties as JsxUtilityProperties } from './style-props';\n",
            ""
        );
        updated = updated.replace(
            "import type { SystemProperties as JsxUtilityProperties } from './style-props';",
            ""
        );
        updated = updated.replace(
            "export type JsxStyleProps = JsxUtilityProperties & WithCss",
            "export type JsxStyleProps = SystemStyleObject & WithCss"
        );
        if (updated !== content) {
            await fs.writeFile(systemPath, updated);
        }
        return;
    }

    if (content.includes("JsxUtilityProperties")) {
        return;
    }

    if (!content.includes("from './style-props'")) {
        content = content.replace(
            "import type { TokenValue } from './tokens';",
            `import type { TokenValue } from './tokens';\nimport type { SystemProperties as JsxUtilityProperties } from './style-props';`
        );
    }

    content = content.replace(
        "export type JsxStyleProps = SystemStyleObject & WithCss",
        "export type JsxStyleProps = JsxUtilityProperties & WithCss"
    );

    await fs.writeFile(systemPath, content);
}

/** Pattern prop types must match whichever file defines real `SystemProperties`. */
export async function updatePatternTypeImports(patternsFolder: string, typesFolder?: string) {
    let entries: string[];
    try {
        entries = await fs.readdir(patternsFolder);
    } catch {
        return;
    }

    const useStyleProps = typesFolder ? await hasRealStyleProps(typesFolder) : true;

    await Promise.all(
        entries
            .filter((file) => file.endsWith(".d.ts"))
            .map(async (file) => {
                const filePath = path.join(patternsFolder, file);
                let content = await fs.readFile(filePath, "utf8");

                if (!useStyleProps) {
                    if (!content.includes("from '../types/style-props'")) return;
                    let updated = content.replace(
                        PATTERN_TYPES_IMPORT_WITH_CONDITIONAL,
                        PANDA_V2_PATTERN_TYPES_IMPORT_WITH_CONDITIONAL
                    );
                    updated = updated.replace(PATTERN_TYPES_IMPORT, PANDA_V2_PATTERN_TYPES_IMPORT);
                    if (updated !== content) {
                        await fs.writeFile(filePath, updated);
                    }
                    return;
                }

                if (content.includes("from '../types/style-props'")) return;
                if (content.includes("ConditionalValue, SystemProperties, SystemStyleObject")) {
                    content = content.replace(
                        LEGACY_PATTERN_TYPES_IMPORT_WITH_CONDITIONAL,
                        PATTERN_TYPES_IMPORT_WITH_CONDITIONAL
                    );
                } else if (content.includes("SystemProperties, SystemStyleObject")) {
                    content = content.replace(LEGACY_PATTERN_TYPES_IMPORT, PATTERN_TYPES_IMPORT);
                } else {
                    return;
                }
                await fs.writeFile(filePath, content);
            })
    );
}
