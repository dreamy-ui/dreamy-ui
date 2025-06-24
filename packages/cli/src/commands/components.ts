import {
	writePatternsIndexFile,
	writeRecipesIndexFile
} from "@/utils/index-files";
import * as p from "@clack/prompts";
import { boxen } from "@visulima/boxen";
import { Command } from "commander";
import createDebug from "debug";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path/posix";
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
import {
	type CompositionFile,
	type Compositions,
	addCommandFlagsSchema
} from "../utils/schema";
import { uniq } from "../utils/shared";
import { tasks } from "../utils/tasks";

const debug = createDebug("dreamy-ui:components");

export const ComponentsCommand = new Command("components")
	.description("Add components to your project")
	.addCommand(
		new Command("add")
			.description("Add a new component")
			.argument("[components...]", "components to add")
			.option("-d, --dry-run", "Dry run")
			.option(
				"--outdir <dir>",
				"Output directory to write the components"
			)
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
					const basePath = pathParts
						.slice(0, componentsIndex + 1)
						.join("/");
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

				const deps = uniq(
					components.flatMap((id) => getFileDependencies(items, id))
				);

				const fileDependencies = uniq(
					deps.flatMap((dep) => dep.fileDependencies)
				);

				debug("fileDependencies", fileDependencies);

				// Create a list of all component IDs (selected + dependencies) for recipes/patterns
				// Extract component IDs from file dependencies by removing file extensions
				const dependencyComponentIds = fileDependencies.map((dep) =>
					dep.replace(/\.(tsx|ts|jsx|js)$/, "")
				);
				const allComponentIds = uniq([
					...components,
					...dependencyComponentIds
				]);

				debug("allComponentIds", allComponentIds);

				const skippedFiles: string[] = [];
				const skippedRecipes: string[] = [];
				const skippedPatterns: string[] = [];

				// Get recipes for all components (selected + dependencies)
				const componentRecipes = await Promise.all(
					allComponentIds.map(async (id) => {
						const recipe = await getRecipeForComponent(
							id,
							recipesDir
						);
						return recipe ? { componentId: id, recipe } : null;
					})
				);

				const validRecipes = componentRecipes.filter(Boolean) as Array<{
					componentId: string;
					recipe: { id: string; content: string };
				}>;

				// Get patterns for all components (selected + dependencies)
				const componentPatterns = await Promise.all(
					allComponentIds.map(async (id) => {
						const pattern = await getPatternForComponent(
							id,
							patternsDir
						);
						return pattern ? { componentId: id, pattern } : null;
					})
				);

				const validPatterns = componentPatterns.filter(
					Boolean
				) as Array<{
					componentId: string;
					pattern: { id: string; content: string };
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
									if (
										existsSync(join(outdir, dep)) &&
										!force
									) {
										skippedFiles.push(dep);
										return;
									}
									const item = await fetchComposition(dep);

									if (jsx) {
										item.file.name = item.file.name.replace(
											".tsx",
											".jsx"
										);
										await transformToJsx(item);
									}

									const outPath = join(
										outdir,
										item.file.name
									);

									await writeFile(
										outPath,
										item.file.content.replace(
											"compositions/ui",
											"."
										),
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
								validRecipes.map(
									async ({ componentId, recipe }) => {
										let recipeFilename = `${recipe.id}.ts`;
										if (jsx) {
											recipeFilename =
												recipeFilename.replace(
													".ts",
													".js"
												);
										}

										const recipeOutPath = join(
											recipesDir,
											recipeFilename
										);

										if (
											existsSync(recipeOutPath) &&
											!force
										) {
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
											recipeContent =
												await convertTsxToJsx(
													recipeContent
												);
										}

										if (dryRun) {
											printRecipeSync({
												id: recipe.id,
												content: recipeContent,
												filename: recipeFilename
											});
										} else {
											await writeFile(
												recipeOutPath,
												recipeContent,
												"utf-8"
											);
										}
									}
								)
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
								validPatterns.map(
									async ({ componentId, pattern }) => {
										let patternFilename = `${pattern.id}.ts`;
										if (jsx) {
											patternFilename =
												patternFilename.replace(
													".ts",
													".js"
												);
										}

										const patternOutPath = join(
											patternsDir,
											patternFilename
										);

										if (
											existsSync(patternOutPath) &&
											!force
										) {
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
											patternContent =
												await convertTsxToJsx(
													patternContent
												);
										}

										if (dryRun) {
											printPatternSync({
												id: pattern.id,
												content: patternContent,
												filename: patternFilename
											});
										} else {
											await writeFile(
												patternOutPath,
												patternContent,
												"utf-8"
											);
										}
									}
								)
							);

							await writePatternsIndexFile(
								patternsDir,
								jsx,
								debug
							);

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
										filename = filename.replace(
											".tsx",
											".jsx"
										);
									}

									if (
										existsSync(join(outdir, filename)) &&
										!force
									) {
										skippedFiles.push(id);
										return;
									}

									try {
										const item = await fetchComposition(id);
										if (jsx) {
											item.file.name =
												item.file.name.replace(
													".tsx",
													".jsx"
												);
											await transformToJsx(item);
										}

										const outPath = join(
											outdir,
											item.file.name
										);

										if (dryRun) {
											printFileSync(item);
										} else {
											await writeFile(
												outPath,
												item.file.content.replace(
													"compositions/ui",
													"."
												),
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
			})
	)
	.addCommand(
		new Command("list")
			.description("List available components")
			.action(async () => {
				const { default: Table } = await import("cli-table");

				const table = new Table({
					head: ["name", "dependencies", "has recipe", "has pattern"],
					colWidths: [20, 30, 12, 12],
					style: { compact: true }
				});

				const items = await fetchCompositions();

				if (!Array.isArray(items)) {
					throw new Error("[dreamy-ui] invalid json response");
				}

				items.forEach((item) => {
					const deps = item.fileDependencies;
					const depsString = deps.length ? deps.join(", ") : "-";
					const hasRecipeString = item.hasRecipe ? "✅" : "❌";
					const hasPatternString = item.hasPattern ? "✅" : "❌";
					table.push([
						item.id,
						depsString,
						hasRecipeString,
						hasPatternString
					]);
				});

				p.log.info(`Found ${items.length} components`);

				p.log.info(table.toString());

				p.outro("🎉 Done!");
			})
	);

async function transformToJsx(item: CompositionFile) {
	const content = await convertTsxToJsx(item.file.content);
	item.file.content = content;
	item.file.name = item.file.name.replace(".tsx", ".jsx");
}

function printFileSync(item: CompositionFile) {
	const boxText = boxen(item.file.content, {
		headerText: `${item.file.name}\n`,
		borderStyle: "none"
	});
	p.log.info(boxText);
}

function printRecipeSync({
	id,
	content,
	filename
}: {
	id: string;
	content: string;
	filename: string;
}) {
	const boxText = boxen(content, {
		headerText: `Recipe: ${filename}\n`,
		borderStyle: "none"
	});
	p.log.info(boxText);
}

function printPatternSync({
	id,
	content,
	filename
}: {
	id: string;
	content: string;
	filename: string;
}) {
	const boxText = boxen(content, {
		headerText: `Pattern: ${filename}\n`,
		borderStyle: "none"
	});
	p.log.info(boxText);
}

const RECOMMENDED_COMPONENTS = ["button", "flex", "text", "heading"];

function getComponents(opts: {
	components: string[];
	all: boolean | undefined;
	items: Compositions;
}) {
	const { components, all, items } = opts;
	if (components.length === 0 && !all)
		return {
			message: "No components selected, adding recommended components...",
			items: RECOMMENDED_COMPONENTS
		};

	if (all)
		return {
			message: "Adding all components...",
			items: items.map((item) => item.id)
		};

	return {
		message: `Adding ${components.length} component${
			components.length > 1 ? "s" : ""
		}...`,
		items: components
	};
}
