import fs from "node:fs/promises";
import path from "node:path";

export async function updateSplitJsxProps(jsxFolder: string) {
    const helperPath = path.join(jsxFolder, "helper.js");
    let content = await fs.readFile(helperPath, "utf8");

    if (content.includes("dreamyUiIsDataProp")) {
        return;
    }

    const marker = "} else if (isCssProperty(key)) {";
    const replacement = "} else if (isCssProperty(key) && !dreamyUiIsDataProp(key, value)) {";

    if (!content.includes(marker)) {
        throw new Error("Could not patch splitJsxProps in helper.js");
    }

    content = content.replace(marker, replacement);

    const insertAfter = "const hasOwn = Object.prototype.hasOwnProperty\n";
    const checksFn = `function dreamyUiIsDataProp(key, value) {
  if (key === "items" && Array.isArray(value)) return true
  return false
}

`;

    content = content.replace(insertAfter, insertAfter + checksFn);

    await fs.writeFile(helperPath, content);
}
