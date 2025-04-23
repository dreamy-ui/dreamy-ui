import * as p from "@clack/prompts";
import { boxen } from "@visulima/boxen";
import { Command } from "commander";
import createDebug from "debug";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path/posix";
import { getProjectContext } from "../utils/context";
import { convertTsxToJsx } from "../utils/convert-tsx-to-jsx";
import { fetchComposition, fetchCompositions } from "../utils/fetch";
import {
	findCompositionById,
	getFileDependencies
} from "../utils/get-file-dependencies";
import { ensureDir } from "../utils/io";
import { installCommand } from "../utils/run-command";
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
				ensureDir(outdir);

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
					deps.map((dep) => dep.fileDependencies).flat()
				);
				const npmDependencies = uniq(
					deps.map((dep) => dep.npmDependencies).flat()
				);

				debug("fileDependencies", fileDependencies);
				debug("npmDependencies", npmDependencies);

				let skippedFiles: string[] = [];

				await tasks([
					{
						title: `Installing required dependencies...`,
						enabled: !!npmDependencies.length && !dryRun,
						task: () =>
							installCommand(
								[...npmDependencies, "--silent"],
								outdir
							)
					},
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
						}
					},
					{
						title: "Writing selected components",
						task: async () => {
							await Promise.all(
								components.map(async (id) => {
									let filename =
										findCompositionById(items, id)?.file ??
										id + ".tsx";
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
						}
					}
				]);

				if (skippedFiles.length) {
					p.log.warn(
						`Skipping ${skippedFiles.length} file(s) that already exist. Use the --force flag to overwrite.`
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
					head: ["name", "dependencies"],
					colWidths: [20, 30],
					style: { compact: true }
				});

				const items = await fetchCompositions();

				if (!Array.isArray(items)) {
					throw new Error("[dreamy-ui] invalid json response");
				}

				items.forEach((item) => {
					const deps = item.npmDependencies;
					const depsString = deps.length ? deps.join(", ") : "-";
					table.push([item.id, depsString]);
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

const RECOMMENDED_COMPONENTS = ["provider"];

function getComponents(opts: {
	components: string[];
	all: boolean | undefined;
	items: Compositions;
}) {
	const { components, all, items } = opts;
	if (components.length === 0 && !all)
		return {
			message:
				"No component(s) selected, adding recommended components...",
			items: RECOMMENDED_COMPONENTS
		};

	if (all)
		return {
			message: "Adding all components...",
			items: items.map((item) => item.id)
		};

	return {
		message: `Adding ${components.length} component(s)...`,
		items: components
	};
}
