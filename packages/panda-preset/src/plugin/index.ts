import path from "node:path";
import { type Config, definePlugin } from "@pandacss/dev";
import type { PandaPlugin } from "@pandacss/types";
import chalk from "chalk";
import { updateFactory } from "./factory";
import { removeGeneratedRecipeContextFiles, removeJsxElements } from "./remove-jsx-elements";
import { ensureJsxFolderExists, ensureStyledSystemExists, ensureTypesFolderExists } from "./system";
import { updateIsValidProp } from "./update-is-valid-prop";
import { updateSplitJsxProps } from "./update-split-jsx-props";
import { updateJsxStyleProps, updatePatternTypeImports } from "./update-system-types";
import { updateStyleContextTypes, writeDreamyStyleContext } from "./update-style-context";

export interface DreamyPluginOptions {
    /**
     * Whether to remove the jsx generated files from the `jsx` directory in the `styled-system` folder.
     * @default true
     */
    removeJsxElements?: boolean;
    /**
     * Whether to remove the "dreamy" factory from the style context.
     * @default true
     */
    removeFactoryFromStyleContext?: boolean;
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
export function dreamyPlugin(options?: DreamyPluginOptions): PandaPlugin {
    const {
        removeJsxElements: removeJsxElementsOption = true,
        updateFactory: updateFactoryOption = true,
        removeFactoryFromStyleContext: removeFactoryFromStyleContextOption = true,
        cwd = process.cwd()
    } = options ?? {};

    let logLevel: Config["logLevel"] = "info";

    return definePlugin({
        name: "dreamy-plugin",
        hooks: {
            "config:resolved": ({ config }) => {
                logLevel = config.logLevel;
            },
            "codegen:done": async () => {
                const isSilent = logLevel === "silent";

                const start = performance.now();

                const styledFolder = await ensureStyledSystemExists(cwd);
                const patternsFolder = path.join(styledFolder, "patterns");
                const [jsxFolder, typesFolder] = await Promise.all([
                    ensureJsxFolderExists(styledFolder),
                    updateFactoryOption ? ensureTypesFolderExists(styledFolder) : null
                ]);

                if (removeFactoryFromStyleContextOption) {
                    await updateStyleContextTypes(jsxFolder);
                    await writeDreamyStyleContext(jsxFolder);
                    await removeGeneratedRecipeContextFiles(jsxFolder);
                }
                if (removeJsxElementsOption) {
                    await removeJsxElements(jsxFolder);
                }
                if (updateFactoryOption && typesFolder) {
                    await updateFactory(jsxFolder, typesFolder);
                    await updateJsxStyleProps(typesFolder);
                    await updatePatternTypeImports(patternsFolder);
                    await updateIsValidProp(typesFolder, jsxFolder);
                    await updateSplitJsxProps(jsxFolder);
                }

                const end = performance.now();

                if (!isSilent) {
                    console.log(
                        chalk.ansi256(140)("✔️  Dreamy UI"),
                        chalk.reset("has successfully modified"),
                        chalk.cyan("`styled-system/jsx`"),
                        chalk.reset("and"),
                        chalk.cyan("`styled-system/types`"),
                        chalk.gray(` (${(end - start).toFixed(0)}ms)`)
                    );
                }
            },
        }
    });
}
