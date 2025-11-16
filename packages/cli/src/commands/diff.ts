import { join } from "node:path";
import * as p from "@clack/prompts";
import { boxen } from "@visulima/boxen";
import { Command } from "commander";
import createDebug from "debug";
import picocolors from "picocolors";
import { getProjectContext } from "../utils/context";
import {
    compareContent,
    generateDiff,
    getLocalContent,
    scanLocalComponents,
    scanLocalFiles
} from "../utils/diff";
import { fetchComposition, fetchPattern, fetchRecipe } from "../utils/fetch";

const debug = createDebug("dreamy-ui:diff");

interface DiffResult {
    id: string;
    type: "component" | "recipe" | "pattern";
    hasChanges: boolean;
    localPath: string;
}

export const DiffCommand = new Command("diff")
    .description("Check for updates in added components")
    .argument("[components...]", "Specific components to show detailed diff for")
    .option("--outdir <dir>", "Directory containing the components")
    .option("--tsx", "Use TypeScript/TSX")
    .action(async (components: string[], flags: { outdir?: string; tsx?: boolean }) => {
        const ctx = await getProjectContext({
            cwd: flags.outdir || process.cwd(),
            tsx: flags.tsx
        });

        debug("context", ctx);

        const jsx = !ctx.isTypeScript;
        const outdir = flags.outdir || ctx.scope.componentsDir;

        // Find the components directory and derive recipes/patterns directories
        const pathParts = outdir.split(/[\/\\]/);
        const componentsIndex = pathParts.lastIndexOf("components");
        let recipesDir: string;
        let patternsDir: string;

        if (componentsIndex !== -1) {
            const basePath = pathParts.slice(0, componentsIndex + 1).join("/");
            recipesDir = join(basePath, "recipes");
            patternsDir = join(basePath, "patterns");
        } else {
            recipesDir = join(outdir, "recipes");
            patternsDir = join(outdir, "patterns");
        }

        const spinner = p.spinner();
        spinner.start("Scanning local components...");

        // Scan local files
        const localComponents = scanLocalComponents(outdir, jsx);
        const localRecipes = scanLocalFiles(recipesDir, jsx);
        const localPatterns = scanLocalFiles(patternsDir, jsx);

        debug("localComponents", localComponents);
        debug("localRecipes", localRecipes);
        debug("localPatterns", localPatterns);

        if (
            localComponents.length === 0 &&
            localRecipes.length === 0 &&
            localPatterns.length === 0
        ) {
            spinner.stop("No components found in the project");
            p.outro("🎉 Done!");
            return;
        }

        spinner.message("Comparing with registry...");

        const results: DiffResult[] = [];

        // Check components
        for (const componentId of localComponents) {
            try {
                const registryComponent = await fetchComposition(componentId);
                const localPath = join(
                    outdir,
                    jsx ? `${componentId}.jsx` : registryComponent.file.name || `${componentId}.tsx`
                );

                const hasChanges = compareContent(localPath, registryComponent.file.content);

                results.push({
                    id: componentId,
                    type: "component",
                    hasChanges,
                    localPath
                });

                debug(`Component ${componentId}: hasChanges=${hasChanges}`);
            } catch (error) {
                debug(
                    `Failed to fetch component ${componentId}:`,
                    error instanceof Error ? error.message : error
                );
            }
        }

        // Check recipes
        for (const { id: recipeId, path: localPath } of localRecipes) {
            try {
                const registryRecipe = await fetchRecipe(recipeId);
                if (!registryRecipe) continue;

                const hasChanges = compareContent(localPath, registryRecipe.file.content);

                results.push({
                    id: recipeId,
                    type: "recipe",
                    hasChanges,
                    localPath
                });

                debug(`Recipe ${recipeId}: hasChanges=${hasChanges}`);
            } catch (error) {
                debug(
                    `Failed to fetch recipe ${recipeId}:`,
                    error instanceof Error ? error.message : error
                );
            }
        }

        // Check patterns
        for (const { id: patternId, path: localPath } of localPatterns) {
            try {
                const registryPattern = await fetchPattern(patternId);
                if (!registryPattern) continue;

                const hasChanges = compareContent(localPath, registryPattern.file.content);

                results.push({
                    id: patternId,
                    type: "pattern",
                    hasChanges,
                    localPath
                });

                debug(`Pattern ${patternId}: hasChanges=${hasChanges}`);
            } catch (error) {
                debug(
                    `Failed to fetch pattern ${patternId}:`,
                    error instanceof Error ? error.message : error
                );
            }
        }

        spinner.stop("Comparison complete");

        // If specific components requested, show detailed diffs
        if (components && components.length > 0) {
            for (const componentId of components) {
                const componentResult = results.find(
                    (r) => r.id === componentId && r.type === "component"
                );

                if (!componentResult) {
                    p.log.warn(`Component "${componentId}" not found in local project`);
                    continue;
                }

                // Helper function to generate and display diff
                async function displayDiff(
                    result: DiffResult,
                    registryContent: string,
                    filename: string,
                    label: string
                ) {
                    const localContent = getLocalContent(result.localPath);
                    if (!localContent) {
                        p.log.error(`Failed to read local file: ${result.localPath}`);
                        return;
                    }

                    const diff = generateDiff(localContent, registryContent, filename);

                    // Colorize the diff
                    const colorizedDiff = diff
                        .split("\n")
                        .map((line) => {
                            if (line.startsWith("+")) {
                                return picocolors.green(line);
                            }
                            if (line.startsWith("-")) {
                                return picocolors.red(line);
                            }
                            if (line.startsWith("@@")) {
                                return picocolors.cyan(line);
                            }
                            return line;
                        })
                        .join("\n");

                    const boxText = boxen(colorizedDiff, {
                        headerText: `${label}\n`,
                        padding: 1,
                        borderStyle: "round"
                    });

                    p.log.info(`${boxText}`);
                }

                try {
                    // Fetch the component to get its recipes and patterns
                    const registryComponent = await fetchComposition(componentId);

                    // Show component diff if it has changes
                    if (componentResult.hasChanges) {
                        await displayDiff(
                            componentResult,
                            registryComponent.file.content,
                            registryComponent.file.name,
                            `Diff for ${componentId} (component)`
                        );
                    } else {
                        p.log.success(`✅ Component ${componentId} is up to date`);
                    }

                    // Check and display diffs for associated recipes
                    if (
                        registryComponent.hasRecipe &&
                        registryComponent.recipeIds &&
                        registryComponent.recipeIds.length > 0
                    ) {
                        for (const recipeId of registryComponent.recipeIds) {
                            const recipeResult = results.find(
                                (r) => r.id === recipeId && r.type === "recipe"
                            );

                            if (recipeResult) {
                                if (recipeResult.hasChanges) {
                                    const registryRecipe = await fetchRecipe(recipeId);
                                    if (registryRecipe) {
                                        await displayDiff(
                                            recipeResult,
                                            registryRecipe.file.content,
                                            registryRecipe.file.name,
                                            `Diff for ${recipeId} (recipe for ${componentId})`
                                        );
                                    }
                                } else {
                                    p.log.success(`✅ Recipe ${recipeId} is up to date`);
                                }
                            }
                        }
                    }

                    // Check and display diffs for associated patterns
                    if (
                        registryComponent.hasPattern &&
                        registryComponent.patternIds &&
                        registryComponent.patternIds.length > 0
                    ) {
                        for (const patternId of registryComponent.patternIds) {
                            const patternResult = results.find(
                                (r) => r.id === patternId && r.type === "pattern"
                            );

                            if (patternResult) {
                                if (patternResult.hasChanges) {
                                    const registryPattern = await fetchPattern(patternId);
                                    if (registryPattern) {
                                        await displayDiff(
                                            patternResult,
                                            registryPattern.file.content,
                                            registryPattern.file.name,
                                            `Diff for ${patternId} (pattern for ${componentId})`
                                        );
                                    }
                                } else {
                                    p.log.success(`✅ Pattern ${patternId} is up to date`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    p.log.error(
                        `Failed to generate diff for ${componentId}: ${
                            error instanceof Error ? error.message : String(error)
                        }`
                    );
                }
            }

            p.outro("🎉 Done!");
            return;
        }

        // Filter and display results
        const changedComponents = results.filter((r) => r.hasChanges && r.type === "component");
        const changedRecipes = results.filter((r) => r.hasChanges && r.type === "recipe");
        const changedPatterns = results.filter((r) => r.hasChanges && r.type === "pattern");

        const upToDateComponents = results.filter((r) => !r.hasChanges && r.type === "component");
        const upToDateRecipes = results.filter((r) => !r.hasChanges && r.type === "recipe");
        const upToDatePatterns = results.filter((r) => !r.hasChanges && r.type === "pattern");

        // Display results
        if (
            changedComponents.length > 0 ||
            changedRecipes.length > 0 ||
            changedPatterns.length > 0
        ) {
            p.log.warn("📦 Updates available:");

            if (changedComponents.length > 0) {
                p.log.info("  Components:");
                p.log.message(`    • ${changedComponents.map((c) => c.id).join("\n    • ")}`);
            }

            if (changedRecipes.length > 0) {
                p.log.info("  Recipes:");
                p.log.message(`    • ${changedRecipes.map((r) => r.id).join("\n    • ")}`);
            }

            if (changedPatterns.length > 0) {
                p.log.info("  Patterns:");
                p.log.message(`    • ${changedPatterns.map((p) => p.id).join("\n    • ")}`);
            }

            const totalUpdates =
                changedComponents.length + changedRecipes.length + changedPatterns.length;

            p.log.info(`Total: ${totalUpdates} update${totalUpdates > 1 ? "s" : ""} available`);
            p.log.info(
                `Run "dreamy diff ${changedComponents.map((c) => c.id).join(" ")}" to see the changes`
            );
            p.log.info(
                `Run "dreamy components add ${changedComponents.map((c) => c.id).join(" ")} --force" to update`
            );
        }

        if (
            upToDateComponents.length > 0 ||
            upToDateRecipes.length > 0 ||
            upToDatePatterns.length > 0
        ) {
            const totalUpToDate =
                upToDateComponents.length + upToDateRecipes.length + upToDatePatterns.length;

            p.log.success(
                `✅ ${totalUpToDate} file${totalUpToDate > 1 ? "s are" : " is"} up to date`
            );
        }

        p.outro("🎉 Done!");
    });
