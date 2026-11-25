import fs from "node:fs/promises";
import path from "node:path";

const KEEP_PREFIXES = [
    "index",
    "factory",
    "helper",
    "is-valid-prop",
    "create-style-context",
    "create-slot-recipe-context",
    "create-recipe-context"
];

export async function removeJsxElements(jsxFolder: string) {
    const files = await fs.readdir(jsxFolder);
    let js: "mjs" | "js" | "both" = "js";

    const indexJs = await fs.readFile(path.join(jsxFolder, "index.js"), "utf-8").catch(() => null);
    const indexMjs = await fs.readFile(path.join(jsxFolder, "index.mjs"), "utf-8").catch(() => null);

    if (indexJs && indexMjs) {
        js = "both";
    } else if (indexJs) {
        js = "js";
    } else if (indexMjs) {
        js = "mjs";
    }

    const indexContent = `export * from './factory.js';
export * from './is-valid-prop.js';
export * from './create-style-context.js';
`;

    const indexDts = `export * from './factory';
export * from './is-valid-prop';
export * from './create-style-context';
export type { HTMLDreamyProps, DreamyComponent } from '../types/jsx';
`;

    await Promise.all([
        (js === "js" || js === "both") && fs.writeFile(path.join(jsxFolder, "index.js"), indexContent),
        (js === "mjs" || js === "both") && fs.writeFile(path.join(jsxFolder, "index.mjs"), indexContent),
        fs.writeFile(path.join(jsxFolder, "index.d.ts"), indexDts)
    ]);

    await Promise.all(
        files
            .filter((file) => !KEEP_PREFIXES.some((prefix) => file.startsWith(prefix)))
            .map((file) => fs.unlink(path.join(jsxFolder, file)).catch(() => {}))
    );
}

export async function removeGeneratedRecipeContextFiles(jsxFolder: string) {
    await Promise.all([
        fs.unlink(path.join(jsxFolder, "create-slot-recipe-context.js")).catch(() => {}),
        fs.unlink(path.join(jsxFolder, "create-slot-recipe-context.d.ts")).catch(() => {}),
        fs.unlink(path.join(jsxFolder, "create-recipe-context.js")).catch(() => {}),
        fs.unlink(path.join(jsxFolder, "create-recipe-context.d.ts")).catch(() => {})
    ]);
}
