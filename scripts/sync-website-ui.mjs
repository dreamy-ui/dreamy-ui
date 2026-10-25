import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = join(root, "website/components/ui");
const compRoot = join(root, "components");

function transformContentForOutput(content) {
    return content
        .replace(
            /from (["'])\.\.\/([^/"']+)\/([^"']+)\1/g,
            "from $1./$3$1"
        )
        .replace(/from (["'])\.\.\/([^/"']+)\1/g, "from $1./$2$1")
        .replace(/components\/ui/g, ".");
}

const dirs = readdirSync(compRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

let synced = 0;
for (const id of dirs) {
    const src = join(compRoot, id, "index.tsx");
    if (!existsSync(src)) continue;
    const dest = join(uiDir, `${id}.tsx`);
    if (!existsSync(dest)) continue;
    const out = transformContentForOutput(readFileSync(src, "utf8"));
    const prev = readFileSync(dest, "utf8");
    if (out !== prev) {
        writeFileSync(dest, out);
        synced++;
        console.log("synced", id);
    }
}
console.log("done", synced);
