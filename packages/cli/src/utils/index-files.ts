import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path/posix";
import type { Debugger } from "debug";

const INDEX_FILENAMES = new Set(["index.ts", "index.tsx", "index.js", "index.jsx"]);

interface RecipePatternEntry {
    fileName: string;
    exportName: string;
}

function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toPascalCase(str: string): string {
    return str
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
}

function isIndexFile(file: string): boolean {
    return INDEX_FILENAMES.has(file);
}

function isRecipeOrPatternSourceFile(file: string, jsx: boolean): boolean {
    if (isIndexFile(file)) {
        return false;
    }

    return (jsx && file.endsWith(".js")) || (!jsx && file.endsWith(".ts"));
}

function isComponentSourceFile(file: string, jsx: boolean): boolean {
    if (isIndexFile(file)) {
        return false;
    }

    return (
        (jsx && (file.endsWith(".jsx") || file.endsWith(".js"))) ||
        (!jsx && (file.endsWith(".tsx") || file.endsWith(".ts")))
    );
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

function extractExportNames(fileContent: string, expectedExportName: string): string | undefined {
    const exportMatches = [
        ...fileContent.matchAll(/export\s+const\s+(\w+)\s*=/g),
        ...fileContent.matchAll(/export\s+\{\s*(\w+)\s*\}/g),
        ...fileContent.matchAll(/export\s+\{\s*(\w+)\s+as\s+\w+\s*\}/g)
    ];

    return exportMatches.map((match) => match[1]).find((name) => name === expectedExportName);
}

function parseRecipePatternCustomEntries(
    content: string,
    objectName: "recipes" | "patterns",
    generatedExportNames: Set<string>
): RecipePatternEntry[] {
    const importMap = new Map<string, string>();
    const importRegex = /import\s+\{\s*(\w+)\s*\}\s+from\s+["']\.\/([^"']+)["'];?/g;

    for (const match of content.matchAll(importRegex)) {
        importMap.set(match[1], match[2]);
    }

    const objectRegex = new RegExp(`export\\s+const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\};`);
    const objectMatch = content.match(objectRegex);
    if (!objectMatch) {
        return [];
    }

    const exportNames = objectMatch[1]
        .split(",")
        .map((segment) => segment.trim().replace(/\/\/.*$/, ""))
        .filter((segment) => /^\w+$/.test(segment));

    const customEntries: RecipePatternEntry[] = [];

    for (const exportName of exportNames) {
        if (generatedExportNames.has(exportName)) {
            continue;
        }

        const fileName = importMap.get(exportName);
        if (fileName) {
            customEntries.push({ fileName, exportName });
        }
    }

    return customEntries;
}

async function getCustomRecipePatternEntries(
    indexPath: string,
    objectName: "recipes" | "patterns",
    generatedEntries: RecipePatternEntry[],
    sourceDir: string,
    sourceExtension: string
): Promise<RecipePatternEntry[]> {
    if (!(await fileExists(indexPath))) {
        return [];
    }

    try {
        const content = await readFile(indexPath, "utf-8");
        const generatedExportNames = new Set(generatedEntries.map((entry) => entry.exportName));
        const customEntries = parseRecipePatternCustomEntries(
            content,
            objectName,
            generatedExportNames
        );

        const validCustomEntries: RecipePatternEntry[] = [];

        for (const entry of customEntries) {
            const sourcePath = join(sourceDir, `${entry.fileName}${sourceExtension}`);
            if (await fileExists(sourcePath)) {
                validCustomEntries.push(entry);
            }
        }

        return validCustomEntries;
    } catch {
        return [];
    }
}

function buildRecipePatternIndexContent(
    entries: RecipePatternEntry[],
    objectName: "recipes" | "patterns"
): string {
    const imports = entries
        .map(({ fileName, exportName }) => {
            return `import { ${exportName} } from "./${fileName}";`;
        })
        .join("\n");

    const exports = entries.map(({ exportName }) => exportName).join(",\n    ");

    return `${imports}\n\nexport const ${objectName} = {\n    ${exports}\n};\n`;
}

async function collectRecipePatternEntries(
    sourceDir: string,
    jsx: boolean,
    debug: Debugger
): Promise<RecipePatternEntry[]> {
    let sourceFiles: string[] = [];

    try {
        const allFiles = await readdir(sourceDir);
        sourceFiles = allFiles.filter((file) => isRecipeOrPatternSourceFile(file, jsx));
    } catch {
        return [];
    }

    const entries: RecipePatternEntry[] = [];

    for (const file of sourceFiles) {
        try {
            const filePath = join(sourceDir, file);
            const fileContent = await readFile(filePath, "utf-8");
            const fileName = file.replace(/\.(ts|js)$/, "");
            const expectedExportName = toCamelCase(fileName);
            const exportName = extractExportNames(fileContent, expectedExportName);

            if (exportName) {
                entries.push({ fileName, exportName });
            } else {
                debug(`No export found for ${expectedExportName} in ${file}`);
            }
        } catch (error) {
            debug(`Failed to read source file ${file}:`, error);
        }
    }

    return entries;
}

async function writeRecipeOrPatternIndexFile(
    sourceDir: string,
    objectName: "recipes" | "patterns",
    jsx: boolean,
    debug: Debugger
) {
    const generatedEntries = await collectRecipePatternEntries(sourceDir, jsx, debug);
    if (generatedEntries.length === 0) {
        return;
    }

    const indexFilename = jsx ? "index.js" : "index.ts";
    const indexPath = join(sourceDir, indexFilename);
    const sourceExtension = jsx ? ".js" : ".ts";
    const customEntries = await getCustomRecipePatternEntries(
        indexPath,
        objectName,
        generatedEntries,
        sourceDir,
        sourceExtension
    );

    const allEntries = [...generatedEntries, ...customEntries];
    const indexContent = buildRecipePatternIndexContent(allEntries, objectName);

    await writeFile(indexPath, indexContent, "utf-8");
}

export async function writeRecipesIndexFile(recipesDir: string, jsx: boolean, debug: Debugger) {
    await writeRecipeOrPatternIndexFile(recipesDir, "recipes", jsx, debug);
}

export async function writePatternsIndexFile(patternsDir: string, jsx: boolean, debug: Debugger) {
    await writeRecipeOrPatternIndexFile(patternsDir, "patterns", jsx, debug);
}

function parseCustomComponentExportLines(content: string, generatedExportLines: Set<string>): string[] {
    const customExportLines: string[] = [];

    for (const line of content.split("\n")) {
        const trimmedLine = line.trim();
        if (!trimmedLine.startsWith("export ")) {
            continue;
        }

        if (!generatedExportLines.has(trimmedLine)) {
            customExportLines.push(trimmedLine);
        }
    }

    return customExportLines;
}

export async function writeComponentsIndexFile(
    componentsDir: string,
    jsx: boolean,
    debug: Debugger
) {
    let componentFiles: string[] = [];

    try {
        const allFiles = await readdir(componentsDir);
        componentFiles = allFiles.filter((file) => isComponentSourceFile(file, jsx));
    } catch {
        return;
    }

    if (componentFiles.length === 0) {
        return;
    }

    const generatedExports: string[] = [];

    for (const file of componentFiles) {
        try {
            const filePath = join(componentsDir, file);
            const fileContent = await readFile(filePath, "utf-8");
            const fileName = file.replace(/\.(tsx|ts|jsx|js)$/, "");
            const componentName = toPascalCase(fileName);
            const hasRootExport = /\bexport\s+(?:const|function)\s+Root\b/.test(fileContent);

            if (hasRootExport) {
                generatedExports.push(`export * as ${componentName} from "./${fileName}";`);
            } else {
                generatedExports.push(`export * from "./${fileName}";`);
            }
        } catch (error) {
            debug(`Failed to read component file ${file}:`, error);
        }
    }

    if (generatedExports.length === 0) {
        return;
    }

    const generatedExportLines = new Set(generatedExports);
    const indexFilename = jsx ? "index.js" : "index.ts";
    const indexPath = join(componentsDir, indexFilename);
    let customExportLines: string[] = [];

    if (await fileExists(indexPath)) {
        try {
            const existingContent = await readFile(indexPath, "utf-8");
            customExportLines = parseCustomComponentExportLines(existingContent, generatedExportLines);
        } catch (error) {
            debug("Failed to read existing components index file:", error);
        }
    }

    const indexContent = [...generatedExports, ...customExportLines].join("\n") + "\n";

    await writeFile(indexPath, indexContent, "utf-8");
}
