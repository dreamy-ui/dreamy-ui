import fs from "node:fs";

const files = ["components/ui/date-picker.tsx", "components/ui/date-range-picker.tsx"];

for (const file of files) {
    let result = fs.readFileSync(file, "utf8");

    result = result.replace(
        /forwardRef<[^>]+,\s*([\w<>,\s|]+?)>\(\s*\n?\s*function\s+(\w+)\(props,\s*ref\)\s*\{/g,
        "function $2(props: $1) {\n        const { ref } = props;"
    );

    result = result.replace(
        /export const AIO = forwardRef<[^>]+,\s*([\w<>,\s|]+?)>\(\s*\n?\s*function\s+(\w+)\(props,\s*ref\)\s*\{/g,
        "export function AIO(props: $1) {\n    const { ref } = props;"
    );

    result = result.replace(/\n    \}\),\n    "/g, '\n    },\n    "');

    result = result.replace(/import\s*\{([^}]*)\}\s*from\s*["']react["'];?/g, (match, imports) => {
        const parts = imports
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p && !p.includes("forwardRef"));
        return parts.length ? `import { ${parts.join(", ")} } from "react";` : "";
    });

    fs.writeFileSync(file, result);
    const remaining = (result.match(/forwardRef/g) || []).length;
    console.log(`${file}: ${remaining} forwardRef remaining`);
}
