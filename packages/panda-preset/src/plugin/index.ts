import { definePlugin } from "@pandacss/dev";
import chalk from "chalk";
import { ensureJsxFolderExists, ensureStyledSystemExists, ensureTypesFolderExists } from "./system";
import { removeJsxElements } from "./remove-jsx-elements";
import { updateFactory } from "./factory";

export interface DreamyPluginOptions {
	/**
	 * Whether to remove the jsx generated files from the `jsx` directory in the `styled-system` folder.
	 * @default true
	 */
	removeJsxElements?: boolean;
	/**
	 * Whether to update the factory and types files to match dreamy ui needs.
	 * @default true
	 */
	updateFactory?: boolean;
	/**
	 * The current working directory.
	 * @default process.cwd()
	 */
	cwd?: string;
}

/**
 * This plugin is used to modify the `styled-system` folder to remove default
 * JSX generated components from patterns, since Dreamy UI has its own components.
 *
 * It also updates the `styled` factory and types files to match Dreamy UI needs.
 *
 * `jsxFactory: "dreamy"` is required in `panda.config.ts` to make Dreamy UI work.
 */
export function dreamyPlugin(options?: DreamyPluginOptions) {
	const {
		removeJsxElements: removeJsxElementsOption = true,
		updateFactory: updateFactoryOption = true,
		cwd = process.cwd()
	} = options ?? {};

	return definePlugin({
		name: "dreamy-plugin",
		hooks: {
			"codegen:done": async () => {
				const isSilent = process.argv.includes("--silent");

				const styledFolder = await ensureStyledSystemExists(cwd);
				const [jsxFolder, typesFolder] = await Promise.all([
					ensureJsxFolderExists(styledFolder),
					updateFactoryOption ? ensureTypesFolderExists(styledFolder) : null
				]);

				await Promise.all([
					removeJsxElementsOption && removeJsxElements(jsxFolder),
					updateFactoryOption && updateFactory(jsxFolder, typesFolder!)
				]);

				if (!isSilent) {
					console.log(
						chalk.ansi256(140)(`✔️  Dreamy UI`),
						chalk.reset("has successfully modified"),
						chalk.cyan("`styled-system/jsx`"),
						chalk.reset("and"),
						chalk.cyan("`styled-system/types`")
					);
				}
			}
		}
	});
}
