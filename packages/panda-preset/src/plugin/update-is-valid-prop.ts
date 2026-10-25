import fs from "node:fs/promises";
import path from "node:path";

/** Panda / Dreamy JSX shorthands and utilities missing from the generated `cssPropertySet`. */
const EXTRA_CSS_PROPS = [
    "w",
    "h",
    "minW",
    "maxW",
    "minH",
    "maxH",
    "boxSize",
    "p",
    "pt",
    "pr",
    "pb",
    "pl",
    "px",
    "py",
    "ps",
    "pe",
    "m",
    "mt",
    "mr",
    "mb",
    "ml",
    "mx",
    "my",
    "ms",
    "me",
    "bg",
    "bgColor",
    "rounded",
    "backdropBlur",
    "gradientFrom",
    "gradientTo",
    "textGradient",
    "borderWidth",
    "borderColor",
    "borderStyle",
    "divideX",
    "divideY",
    "divideWidth",
    "ring",
    "ringColor",
    "ringOffset",
    "ringWidth",
    "shadow",
    "shadowColor",
    "opacity",
    "zIndex",
    "top",
    "right",
    "bottom",
    "left",
    "insetX",
    "insetY",
    "objectFit",
    "objectPosition",
    "overflowX",
    "overflowY",
    "textDecoration",
    "listStyleType",
    "listStylePosition",
    "flexDir",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridColumn",
    "gridRow",
    "gap",
    "rowGap",
    "columnGap",
    "itemsCenter",
    "textCenter",
    "op"
];

function extractInterfaceKeys(source: string, interfaceName: string) {
    const start = source.indexOf(`export interface ${interfaceName}`);
    if (start === -1) return [];

    const braceStart = source.indexOf("{", start);
    let depth = 0;
    const keys: string[] = [];

    for (let i = braceStart; i < source.length; i++) {
        const char = source[i];
        if (char === "{") depth++;
        else if (char === "}") {
            depth--;
            if (depth === 0) break;
        } else if (depth === 1) {
            const rest = source.slice(i);
            const match = /^\s*([A-Za-z_][\w]*)\?:/.exec(rest);
            if (match) {
                keys.push(match[1]);
                i += match[0].length - 1;
            }
        }
    }

    return keys;
}

export async function updateIsValidProp(typesFolder: string, jsxFolder: string) {
    const validPropPath = path.join(jsxFolder, "is-valid-prop.js");
    let content = await fs.readFile(validPropPath, "utf8");

    if (content.includes("dreamyUiExtraProps")) {
        return;
    }

    const styleProps = await fs.readFile(path.join(typesFolder, "style-props.d.ts"), "utf8");
    const propType = await fs.readFile(path.join(typesFolder, "prop-type.d.ts"), "utf8");

    const keys = new Set([
        ...EXTRA_CSS_PROPS,
        ...extractInterfaceKeys(styleProps, "SystemProperties"),
        ...extractInterfaceKeys(propType, "UtilityValues")
    ]);

    const marker = "const cssPropertySelectorRe = /&|@/";
    const injection = `const dreamyUiExtraProps = new Set(${JSON.stringify([...keys].sort())})\n${marker}`;

    content = content.replace(marker, injection);

    content = content.replace(
        "return cssPropertySet.has(value) || value.startsWith(\"--\") || cssPropertySelectorRe.test(value)",
        "return cssPropertySet.has(value) || dreamyUiExtraProps.has(value) || value.startsWith(\"--\") || cssPropertySelectorRe.test(value)"
    );

    await fs.writeFile(validPropPath, content);
}
