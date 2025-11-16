import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path/posix";
import {
    getComponents,
    printFileSync,
    printPatternSync,
    printRecipeSync,
    transformToJsx
} from "@/utils/components";
import { writePatternsIndexFile, writeRecipesIndexFile } from "@/utils/index-files";
import * as p from "@clack/prompts";
import { Command } from "commander";
import createDebug from "debug";
import { pandaCodegenCommand } from "../utils/codegen-command";
import { getProjectContext } from "../utils/context";
import { convertTsxToJsx } from "../utils/convert-tsx-to-jsx";
import {
    fetchComposition,
    fetchCompositions,
    getPatternForComponent,
    getRecipeForComponent
} from "../utils/fetch";
import { getFileDependencies } from "../utils/get-file-dependencies";
import { ensureDir } from "../utils/io";
import { addCommandFlagsSchema } from "../utils/schema";
import { uniq } from "../utils/shared";
import { tasks } from "../utils/tasks";

const debug = createDebug("dreamy-ui:add");

export const AddCommand = new Command("add")
    .description("Add components to your project")
    .argument("[components...]", "components to add")
    .option("-d, --dry-run", "Dry run")
    .option("--outdir <dir>", "Output directory to write the components")
    .option("--all", "Add all components")
    .option("-f, --force", "Overwrite existing files")
    .option("--tsx", "Convert to TSX")
    .action(async (selectedComponents: string[], flags: unknown) => {
        const parsedFlags = addCommandFlagsSchema.parse(flags);
        const { dryRun, force, all, tsx } = parsedFlags;

        const ctx = await getProjectContext({
            cwd: parsedFlags.outdir || process.cwd(),
            tsx
        });

        debug("context", ctx);

        const jsx = !ctx.isTypeScript;

        const outdir = parsedFlags.outdir || ctx.scope.componentsDir;
        // Find the components directory and place recipes as a sibling to ui
        // e.g., if outdir is "src/components/ui", recipesDir should be "src/components/recipes"
        const pathParts = outdir.split(/[\/\\]/);
        const componentsIndex = pathParts.lastIndexOf("components");
        let recipesDir: string;
        let patternsDir: string;
        if (componentsIndex !== -1) {
            // Build path up to components directory and add recipes/patterns
            const basePath = pathParts.slice(0, componentsIndex + 1).join("/");
            recipesDir = join(basePath, "recipes");
            patternsDir = join(basePath, "patterns");
        } else {
            // Fallback: if no components directory found, use outdir
            recipesDir = join(outdir, "recipes");
            patternsDir = join(outdir, "patterns");
        }
        ensureDir(outdir);
        ensureDir(recipesDir);
        ensureDir(patternsDir);

        const items = await fetchCompositions();

        const inferredComponents = getComponents({
            components: selectedComponents,
            all,
            items
        });

        const components = inferredComponents.items;
        debug("components", components);

        p.log.info(inferredComponents.message);

        const deps = uniq(components.flatMap((id) => getFileDependencies(items, id)));

        const fileDependencies = uniq(deps.flatMap((dep) => dep.fileDependencies));

        debug("fileDependencies", fileDependencies);

        // Create a list of all component IDs (selected + dependencies) for recipes/patterns
        // Extract component IDs from file dependencies by removing file extensions
        const dependencyComponentIds = fileDependencies.map((dep) =>
            dep.replace(/\.(tsx|ts|jsx|js)$/, "")
        );
        const allComponentIds = uniq([...components, ...dependencyComponentIds]);

        debug("allComponentIds", allComponentIds);

        const skippedFiles: string[] = [];
        const skippedRecipes: string[] = [];
        const skippedPatterns: string[] = [];

        // Get recipes for all components (selected + dependencies)
        const componentRecipes = await Promise.all(
            allComponentIds.map(async (id) => {
                const recipes = await getRecipeForComponent(id, recipesDir);
                return recipes.length > 0 ? { componentId: id, recipes } : null;
            })
        );

        const validRecipes = componentRecipes.filter(Boolean) as Array<{
            componentId: string;
            recipes: Array<{ id: string; content: string }>;
        }>;

        // Get patterns for all components (selected + dependencies)
        const componentPatterns = await Promise.all(
            allComponentIds.map(async (id) => {
                const patterns = await getPatternForComponent(id, patternsDir);
                return patterns.length > 0 ? { componentId: id, patterns } : null;
            })
        );

        const validPatterns = componentPatterns.filter(Boolean) as Array<{
            componentId: string;
            patterns: Array<{ id: string; content: string }>;
        }>;

        await tasks([
            // {
            //     title: "Installing required dependencies...",
            //     enabled: !!npmDependencies.length && !dryRun,
            //     task: () => installCommand([...npmDependencies, "--silent"], outdir)
            // },
            {
                title: "Writing file dependencies",
                enabled: !!fileDependencies.length && !dryRun,
                task: async () => {
                    await Promise.all(
                        fileDependencies.map(async (dep) => {
                            if (existsSync(join(outdir, dep)) && !force) {
                                skippedFiles.push(dep);
                                return;
                            }
                            const item = await fetchComposition(dep);

                            if (jsx) {
                                item.file.name = item.file.name.replace(".tsx", ".jsx");
                                await transformToJsx(item);
                            }

                            const outPath = join(outdir, item.file.name);

                            await writeFile(
                                outPath,
                                item.file.content.replace("compositions/ui", "."),
                                "utf-8"
                            );
                        })
                    );

                    return "File dependencies written";
                }
            },
            {
                title: "Writing recipes",
                enabled: !!validRecipes.length && !dryRun,
                task: async () => {
                    await Promise.all(
                        validRecipes.flatMap(async ({ recipes }) => {
                            return Promise.all(
                                recipes.map(async (recipe) => {
                                    let recipeFilename = `${recipe.id}.ts`;
                                    if (jsx) {
                                        recipeFilename = recipeFilename.replace(".ts", ".js");
                                    }

                                    const recipeOutPath = join(recipesDir, recipeFilename);

                                    if (existsSync(recipeOutPath) && !force) {
                                        skippedRecipes.push(recipe.id);
                                        return;
                                    }

                                    let recipeContent = recipe.content;

                                    // Transform recipe imports to use local paths if needed
                                    recipeContent = recipeContent.replace(
                                        /from "@\/recipes\//g,
                                        'from "./'
                                    );

                                    // Convert to JSX if needed
                                    if (jsx) {
                                        recipeContent = await convertTsxToJsx(recipeContent);
                                    }

                                    if (dryRun) {
                                        printRecipeSync({
                                            content: recipeContent,
                                            filename: recipeFilename
                                        });
                                    } else {
                                        await writeFile(recipeOutPath, recipeContent, "utf-8");
                                    }
                                })
                            );
                        })
                    );

                    await writeRecipesIndexFile(recipesDir, jsx, debug);

                    return "Recipes written";
                }
            },
            {
                title: "Writing patterns",
                enabled: !!validPatterns.length && !dryRun,
                task: async () => {
                    await Promise.all(
                        validPatterns.flatMap(async ({ patterns }) => {
                            return Promise.all(
                                patterns.map(async (pattern) => {
                                    let patternFilename = `${pattern.id}.ts`;
                                    if (jsx) {
                                        patternFilename = patternFilename.replace(".ts", ".js");
                                    }

                                    const patternOutPath = join(patternsDir, patternFilename);

                                    if (existsSync(patternOutPath) && !force) {
                                        skippedPatterns.push(pattern.id);
                                        return;
                                    }

                                    let patternContent = pattern.content;

                                    // Transform pattern imports to use local paths if needed
                                    patternContent = patternContent.replace(
                                        /from "@\/patterns\//g,
                                        'from "./'
                                    );

                                    // Convert to JSX if needed
                                    if (jsx) {
                                        patternContent = await convertTsxToJsx(patternContent);
                                    }

                                    if (dryRun) {
                                        printPatternSync({
                                            content: patternContent,
                                            filename: patternFilename
                                        });
                                    } else {
                                        await writeFile(patternOutPath, patternContent, "utf-8");
                                    }
                                })
                            );
                        })
                    );

                    await writePatternsIndexFile(patternsDir, jsx, debug);

                    return "Patterns written";
                }
            },
            {
                title: "Writing selected components",
                task: async () => {
                    await Promise.all(
                        components.map(async (id) => {
                            let filename = id + ".tsx";
                            if (jsx) {
                                filename = filename.replace(".tsx", ".jsx");
                            }

                            if (existsSync(join(outdir, filename)) && !force) {
                                skippedFiles.push(id);
                                return;
                            }

                            try {
                                const item = await fetchComposition(id);
                                if (jsx) {
                                    item.file.name = item.file.name.replace(".tsx", ".jsx");
                                    await transformToJsx(item);
                                }

                                const outPath = join(outdir, item.file.name);

                                if (dryRun) {
                                    printFileSync(item);
                                } else {
                                    await writeFile(
                                        outPath,
                                        item.file.content.replace("compositions/ui", "."),
                                        "utf-8"
                                    );
                                }
                            } catch (error) {
                                if (error instanceof Error) {
                                    p.log.error(error?.message);
                                    process.exit(0);
                                }
                            }
                        })
                    );

                    return "Selected components written";
                }
            },
            {
                title: "Running panda codegen",
                enabled: !dryRun,
                task: async () => {
                    await pandaCodegenCommand(process.cwd());

                    return "panda codegen finished";
                }
            }
        ]);

        if (skippedFiles.length) {
            p.log.warn(
                `Skipped ${skippedFiles.length} component file${
                    skippedFiles.length > 1 ? "s" : ""
                } that already exist. Use the --force flag to overwrite.`
            );
        }

        if (skippedRecipes.length) {
            p.log.warn(
                `Skipped ${skippedRecipes.length} recipe file${
                    skippedRecipes.length > 1 ? "s" : ""
                } that already exist. Use the --force flag to overwrite.`
            );
        }

        if (skippedPatterns.length) {
            p.log.warn(
                `Skipped ${skippedPatterns.length} pattern file${
                    skippedPatterns.length > 1 ? "s" : ""
                } that already exist. Use the --force flag to overwrite.`
            );
        }

        p.outro("🎉 Done!");
    });
