import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

export async function ensureStyledSystemExists(cwd: string) {
    const styledSystemFolder = path.join(cwd, "styled-system");
    if (!(await fs.stat(styledSystemFolder)).isDirectory()) {
        console.error(chalk.blue(`❌ ${chalk.red("styled-system")} folder does not exist.`));
        throw new Error("styled-system folder does not exist");
    }

    return styledSystemFolder;
}

export async function ensureTypesFolderExists(styledFolder: string) {
    const typesFolder = path.join(styledFolder, "types");
    if (!(await fs.stat(typesFolder)).isDirectory()) {
        console.error(chalk.blue(`❌ ${chalk.red("types")} folder does not exist in ${chalk.green(styledFolder)}.`));
        throw new Error("types folder does not exist");
    }

    return typesFolder;
}

export async function ensureJsxFolderExists(styledFolder: string) {
    const jsxFolder = path.join(styledFolder, "jsx");
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
        throw new Error("jsx folder does not exist");
    }

    return jsxFolder;
}
