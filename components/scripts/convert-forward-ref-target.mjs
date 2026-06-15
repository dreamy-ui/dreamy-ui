/**
 * Targeted forwardRef removal for withContext/export patterns.
 * Usage: node components/scripts/convert-forward-ref-target.mjs file1.tsx file2.tsx
 */
import fs from "node:fs";

function skipGeneric(source, start) {
    if (source[start] !== "<") return start;
    let depth = 0;
    for (let i = start; i < source.length; i++) {
        if (source[i] === "<") depth++;
        else if (source[i] === ">") {
            depth--;
            if (depth === 0) return i + 1;
        }
    }
    return start;
}

function extractPropsType(generic) {
    const parts = [];
    let depth = 0;
    let current = "";
    for (const ch of generic) {
        if (ch === "<") depth++;
        else if (ch === ">") depth--;
        else if (ch === "," && depth === 0) {
            parts.push(current.trim());
            current = "";
            continue;
        }
        current += ch;
    }
    if (current.trim()) parts.push(current.trim());
    return parts.length >= 2 ? parts[parts.length - 1] : "unknown";
}

function transformContent(content) {
    let result = content;
    let changed = true;

    while (changed) {
        changed = false;
        const idx = result.indexOf("forwardRef");
        if (idx === -1) break;

        const genericStart = result.indexOf("<", idx);
        const afterGeneric = skipGeneric(result, genericStart);
        const propsType = extractPropsType(result.slice(genericStart + 1, afterGeneric - 1));

        const parenStart = result.indexOf("(", afterGeneric);
        const callback = result.slice(parenStart + 1).trimStart();

        let fnName;
        let params;
        let bodyStart;
        let closeEnd;

        if (callback.startsWith("function")) {
            const fnParenStart = result.indexOf("(", result.indexOf("function", parenStart));
            const fnParenEnd = findMatchingParen(result, fnParenStart);
            params = result.slice(fnParenStart + 1, fnParenEnd);
            fnName = callback.match(/^function\s+(\w+)/)?.[1] ?? "Component";
            bodyStart = result.indexOf("{", fnParenEnd);
            closeEnd = findMatchingBrace(result, bodyStart) + 1;
        } else {
            changed = false;
            break;
        }

        const argList = splitArgs(params);
        const hasRef = argList.length > 0 && argList[argList.length - 1].trim() === "ref";
        const restArgs = hasRef ? argList.slice(0, -1) : argList;
        const argsStr = restArgs.join(", ").trim();

        let header;
        if (restArgs.length === 1 && restArgs[0].trim() === "props") {
            header = `function ${fnName}(props: ${propsType}) {\n        const { ref } = props;`;
        } else if (restArgs.length === 1 && restArgs[0].includes("{")) {
            header = `function ${fnName}(props: ${propsType}) {\n        const { ref, ${restArgs[0].slice(1)} = props;`;
        } else {
            header = `function ${fnName}(${argsStr}: ${propsType}) {`;
        }

        const prefix = result.slice(0, idx);
        const body = result.slice(bodyStart + 1, closeEnd - 1);
        let suffix = result.slice(closeEnd);

        // Remove trailing ) from forwardRef(...)
        if (suffix.startsWith(")")) suffix = suffix.slice(1);

        const isExportConst = /export const \w+ = $/.test(prefix.slice(-30));
        let replacement;
        if (isExportConst) {
            const exportMatch = prefix.match(/export const (\w+) = $/);
            const exportName = exportMatch?.[1] ?? fnName;
            replacement =
                prefix.replace(/export const \w+ = $/, `export function ${exportName}`) +
                header +
                body +
                "\n    }" +
                suffix;
        } else {
            replacement = prefix + header + body + "\n    }" + suffix;
        }

        // Fix withContext inner close: }), -> },
        replacement = replacement.replace(/\n    \}\),\n    "/g, '\n    },\n    "');

        if (replacement !== result) {
            result = replacement;
            changed = true;
        }
    }

    result = result.replace(/import\s*\{([^}]*)\}\s*from\s*["']react["'];?/g, (match, imports) => {
        const parts = imports
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p && !p.includes("forwardRef"));
        if (parts.length === 0) return "";
        return `import { ${parts.join(", ")} } from "react";`;
    });

    return result;
}

function findMatchingParen(source, start) {
    let depth = 0;
    for (let i = start; i < source.length; i++) {
        if (source[i] === "(") depth++;
        else if (source[i] === ")") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function findMatchingBrace(source, start) {
    let depth = 0;
    for (let i = start; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function splitArgs(args) {
    const result = [];
    let current = "";
    let depth = 0;
    for (const ch of args) {
        if (ch === "(" || ch === "{" || ch === "[") depth++;
        else if (ch === ")" || ch === "}" || ch === "]") depth--;
        else if (ch === "," && depth === 0) {
            result.push(current);
            current = "";
            continue;
        }
        current += ch;
    }
    if (current) result.push(current);
    return result;
}

for (const file of process.argv.slice(2)) {
    const content = fs.readFileSync(file, "utf8");
    if (!content.includes("forwardRef")) {
        console.log(`skip (no forwardRef): ${file}`);
        continue;
    }
    const transformed = transformContent(content);
    fs.writeFileSync(file, transformed);
    const remaining = (transformed.match(/forwardRef/g) || []).length;
    console.log(`${file}: ${remaining} forwardRef remaining`);
}
