import { existsSync, readFileSync, readdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { consola } from "consola";
import { ensureDirSync } from "fs-extra";
import {
    WEBSITE_DIR,
    getPatternsDirectory,
    getPublicDirectory,
    getRecipesDirectory,
    getUiDirectory
} from "./paths";

function getImports(content: string) {
    const imports = new Set<string>();
    const matches = Array.from(content.matchAll(/from ["'](.+)["']/g));
    for (const match of matches) {
        imports.add(match[1]);
    }
    return imports;
}

function isNpmDependency(dependencies: string[], _import: string) {
    return dependencies.some((dep) => _import.includes(dep));
}

function isFileDependency(_import: string) {
    return _import.startsWith(".") || _import.startsWith("compositions/ui");
}

function resolveDependency(specifier: string, dependencies: string[]) {
    let result = dependencies.find((dependency) => specifier === dependency);
    if (result) return result;
    const matches = Array.from(specifier.matchAll(/(.+?)\//g));
    if (matches.length) result = matches[0][1];
    return result;
}

function getDependencies(imports: Set<string>, dependencies: string[]) {
    const fileDependencies = new Set<string>();
    const npmDependencies = new Set<string>();

    for (const _import of Array.from(imports)) {
        if (isFileDependency(_import)) {
            fileDependencies.add(_import);
        } else if (isNpmDependency(dependencies, _import)) {
            const dependency = resolveDependency(_import, dependencies);
            if (dependency) {
                npmDependencies.add(dependency);
            }
        }
    }

    return { fileDependencies, npmDependencies };
}

function camelToKebabCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function parseRecipeId(content: string): string[] {
    const recipeIds: string[] = [];

    const importMatches = content.matchAll(
        /import\s+\{([^}]+)\}\s+from\s+["']styled-system\/recipes["']/g
    );
    for (const importMatch of importMatches) {
        const imports = importMatch[1];
        const importList = imports.split(",").map((item) => item.trim());
        for (const item of importList) {
            if (item.startsWith("type ")) {
                continue;
            }
            const match = item.match(/^(\w+)/);
            if (match) {
                recipeIds.push(camelToKebabCase(match[1]));
            }
        }
    }

    const simpleImportMatches = content.matchAll(
        /import\s+(\w+)\s+from\s+["']styled-system\/recipes["']/g
    );
    for (const simpleImportMatch of simpleImportMatches) {
        recipeIds.push(camelToKebabCase(simpleImportMatch[1]));
    }

    return [...new Set(recipeIds)];
}

function parsePatternId(content: string): string[] {
    const patternIds: string[] = [];

    const importMatch = content.match(
        /import\s+\{([^}]+)\}\s+from\s+["']styled-system\/patterns["']/
    );
    if (importMatch) {
        const imports = importMatch[1];
        const importList = imports.split(",").map((item) => item.trim());
        for (const item of importList) {
            if (item.startsWith("type ")) {
                continue;
            }
            const match = item.match(/^(\w+)/);
            if (match) {
                patternIds.push(camelToKebabCase(match[1]));
            }
        }
    }

    const simpleImportMatch = content.match(
        /import\s+(\w+)\s+from\s+["']styled-system\/patterns["']/
    );
    if (simpleImportMatch) {
        patternIds.push(camelToKebabCase(simpleImportMatch[1]));
    }

    const specificPatternMatch = content.match(
        /import\s+\{([^}]+)\}\s+from\s+["']styled-system\/patterns\/(\w+)["']/
    );
    if (specificPatternMatch) {
        const imports = specificPatternMatch[1];
        const importList = imports.split(",").map((item) => item.trim());
        for (const item of importList) {
            if (item.startsWith("type ")) {
                continue;
            }
            const match = item.match(/^(\w+)/);
            if (match) {
                patternIds.push(camelToKebabCase(match[1]));
            }
        }
    }

    return patternIds;
}

const setFileExtension = (file: string, ext: string) => basename(file, extname(file)) + ext;

const excludedDependencies = ["@dreamy-ui/react", "react", "react-dom", "motion"];

const camelCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getFileName = (file: string) => basename(file, extname(file));

const getComponentName = (file: string) => getFileName(file).split("-").map(camelCase).join("");

function generateRecipes(recipesDir: string, publicDir: string) {
    if (!existsSync(recipesDir)) {
        consola.warn(`Recipes directory not found: ${recipesDir}`);
        return [];
    }

    const recipeFiles = readdirSync(recipesDir, { encoding: "utf-8" }).filter((file) =>
        file.endsWith(".ts")
    );

    const recipes = recipeFiles.map((file) => {
        const filePath = join(recipesDir, file);
        const content = readFileSync(filePath, "utf-8");
        const recipeId = getFileName(file);

        return {
            path: join(publicDir, "recipes", setFileExtension(file, ".json")),
            data: {
                type: "recipe",
                id: recipeId,
                file: {
                    name: file,
                    content: content.replace(/from "@\/recipes\//g, 'from "./')
                }
            }
        };
    });

    recipes.push({
        path: join(publicDir, "recipes", "index.json"),
        // @ts-expect-error
        data: recipes.map(({ data }) => ({
            type: data.type,
            id: data.id,
            file: data.file.name
        }))
    });

    return recipes;
}

function generatePatterns(patternsDir: string, publicDir: string) {
    if (!existsSync(patternsDir)) {
        consola.warn(`Patterns directory not found: ${patternsDir}`);
        return [];
    }

    const patternFiles = readdirSync(patternsDir, { encoding: "utf-8" }).filter((file) =>
        file.endsWith(".ts")
    );

    const patterns = patternFiles.map((file) => {
        const filePath = join(patternsDir, file);
        const content = readFileSync(filePath, "utf-8");
        const patternId = getFileName(file);

        return {
            path: join(publicDir, "patterns", setFileExtension(file, ".json")),
            data: {
                type: "pattern",
                id: patternId,
                file: {
                    name: file,
                    content: content.replace(/from "@\/patterns\//g, 'from "./')
                }
            }
        };
    });

    patterns.push({
        path: join(publicDir, "patterns", "index.json"),
        // @ts-expect-error
        data: patterns.map(({ data }) => ({
            type: data.type,
            id: data.id,
            file: data.file.name
        }))
    });

    return patterns;
}

function checkForRecipesOrPatterns(recipeIds: string[], patternIds: string[]) {
    const hasRecipe = !!recipeIds.length;
    const hasPattern = !!patternIds.length;

    return { hasRecipe, hasPattern };
}

export async function main() {
    const componentsDir = getUiDirectory();
    const recipesDir = getRecipesDirectory();
    const patternsDir = getPatternsDirectory();
    const publicDir = getPublicDirectory();

    const pkgJson = readFileSync(join(WEBSITE_DIR, "package.json"), "utf-8");

    const dependencies = Object.keys(JSON.parse(pkgJson).dependencies || {}).filter(
        (dep) => !excludedDependencies.includes(dep)
    );

    const files = readdirSync(componentsDir, { encoding: "utf-8" }).filter(
        (file) => file.endsWith(".tsx") || file.endsWith(".ts")
    );

    console.log("Components directory:", componentsDir);
    console.log("Recipes directory:", recipesDir);
    console.log("Patterns directory:", patternsDir);

    const components = files.map((file) => {
        const filePath = join(componentsDir, file);
        const content = readFileSync(filePath, "utf-8");
        const { fileDependencies, npmDependencies } = getDependencies(
            getImports(content),
            dependencies
        );
        const componentId = getFileName(file);

        const recipeIds = parseRecipeId(content);
        const patternIds = parsePatternId(content);

        const { hasRecipe, hasPattern } = checkForRecipesOrPatterns(recipeIds, patternIds);

        return {
            path: join(publicDir, "components", setFileExtension(file, ".json")),
            data: {
                type: "component",
                npmDependencies: Array.from(npmDependencies),
                fileDependencies: Array.from(fileDependencies),
                id: componentId,
                file: {
                    name: file,
                    content: content.replace("components/ui", ".")
                },
                component: getComponentName(file),
                hasRecipe,
                hasPattern,
                ...(recipeIds.length > 0 && { recipeIds }),
                ...(patternIds.length > 0 && { patternIds })
            }
        };
    });

    components.push({
        path: join(publicDir, "components", "index.json"),
        // @ts-expect-error
        data: components.map(({ data }) => ({
            type: data.type,
            id: data.id,
            file: data.file.name,
            component: data.component,
            npmDependencies: data.npmDependencies,
            fileDependencies: data.fileDependencies,
            hasRecipe: data.hasRecipe,
            hasPattern: data.hasPattern,
            ...(data.recipeIds && { recipeIds: data.recipeIds }),
            ...(data.patternIds && { patternIds: data.patternIds })
        }))
    });

    const recipes = generateRecipes(recipesDir, publicDir);
    const patterns = generatePatterns(patternsDir, publicDir);

    ensureDirSync(join(publicDir, "components"));
    ensureDirSync(join(publicDir, "recipes"));
    ensureDirSync(join(publicDir, "patterns"));

    const allFiles = [...components, ...recipes, ...patterns];
    const promises = allFiles.map(({ path, data }) => {
        const content = JSON.stringify(data, null, 2);
        return writeFile(path, content);
    });

    await Promise.all(promises);

    consola.success(
        `Generated ${components.length - 1} components, ${
            recipes.length - 1
        } recipes, and ${patterns.length - 1} patterns 🎉. Happy coding!`
    );
}

main().catch((err) => {
    consola.error(err);
    process.exit(1);
});
