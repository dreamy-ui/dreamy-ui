import fs from "node:fs/promises";
import path from "node:path";

const PATTERN_TYPES_IMPORT_WITH_CONDITIONAL =
    "import type { ConditionalValue, SystemStyleObject } from '../types/system';\nimport type { SystemProperties } from '../types/style-props';";

const PATTERN_TYPES_IMPORT =
    "import type { SystemStyleObject } from '../types/system';\nimport type { SystemProperties } from '../types/style-props';";

const LEGACY_PATTERN_TYPES_IMPORT_WITH_CONDITIONAL =
    /import type \{ ConditionalValue, SystemProperties, SystemStyleObject \} from '\.\.\/types\/system';/g;

const LEGACY_PATTERN_TYPES_IMPORT =
    /import type \{ SystemProperties, SystemStyleObject \} from '\.\.\/types\/system';/g;

/**
 * Panda v2 splits CSS properties and JSX utility shorthands (`bg`, `p`, `w`, …).
 * `JsxStyleProps` must use `style-props.d.ts`, not `SystemStyleObject` alone.
 */
export async function updateJsxStyleProps(typesFolder: string) {
    const systemPath = path.join(typesFolder, "system.d.ts");
    let content = await fs.readFile(systemPath, "utf8");

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

/** Pattern prop types must use `style-props` so they match `JsxStyleProps` on components. */
export async function updatePatternTypeImports(patternsFolder: string) {
    let entries: string[];
    try {
        entries = await fs.readdir(patternsFolder);
    } catch {
        return;
    }

    await Promise.all(
        entries
            .filter((file) => file.endsWith(".d.ts"))
            .map(async (file) => {
                const filePath = path.join(patternsFolder, file);
                let content = await fs.readFile(filePath, "utf8");
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
