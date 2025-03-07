import { definePlugin } from "@pandacss/dev";
import type { PandaPlugin } from "@pandacss/types";
import chalk from "chalk";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * This plugin is used to modify the `jsx` directory in the `styled-system` folder,
 * to remove the jsx generated filed from patterns, since Dreamy UI has its own jsx implementation.
 *
 * This function does not throw at errors, since it is not required to build.
 */
export const dreamyPlugin: PandaPlugin = definePlugin({
	name: "dreamy-plugin",
	hooks: {
		"codegen:done": async () => {
			// check if styled-system exists
			const styledSystemFolder = path.join(
				process.cwd(),
				"styled-system"
			);
			if (!(await fs.stat(styledSystemFolder)).isDirectory()) {
				console.error(
					chalk.blue(
						`❌ ${chalk.red(
							"styled-system"
						)} folder does not exist.`
					)
				);
				console.log(
					chalk.yellow(
						"Failed when trying to modify `jsx` directory."
					)
				);
				return;
			}

			// check if jsx folder exists
			const jsxFolder = path.join(process.cwd(), "styled-system", "jsx");
			if (!(await fs.stat(jsxFolder)).isDirectory()) {
				console.error(
					chalk.blue(
						`❌ ${chalk.red(
							"jsx"
						)} folder does not exist in styled-system. Did you forget to add ${chalk.green(
							"jsxFramework: 'react'"
						)} to the ${chalk.green("panda.config.ts")}?`
					)
				);
				return;
			}

			const files = await fs.readdir(jsxFolder);
			for (const file of files) {
				if (
					!["index", "factory", "is-valid-prop"].some((prefix) =>
						file.startsWith(prefix)
					)
				) {
					await fs.unlink(path.join(jsxFolder, file));
				}
			}

			// write the index files
			await Promise.all([
				fs.writeFile(
					path.join(jsxFolder, "index.js"),
					`export * from './factory.js';
export * from './is-valid-prop.js';`
				),
				fs.writeFile(
					path.join(jsxFolder, "index.d.ts"),
					`export * from './factory';
export * from './is-valid-prop';
export type { HTMLStyledProps, StyledComponent } from '../types/jsx';`
				)
			]);

			console.log(
				chalk.cyan(
					"✔️  Dreamy UI has successfully modified the jsx files in the styled-system folder."
				)
			);
		}
	}
});
