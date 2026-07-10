/**
 * Remove all node_modules folders and package-manager lock files from the workspace.
 * Usage: node scripts/clean-deps.mjs
 */
import { readdir, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const LOCK_FILES = new Set([
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    "bun.lock",
    "bun.lockb"
]);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules"]);

async function walk(dir, onEntry) {
    let entries;

    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch {
        return;
    }

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) {
                if (entry.name === "node_modules") {
                    onEntry({ type: "node_modules", path: fullPath });
                }
                continue;
            }

            await walk(fullPath, onEntry);
            continue;
        }

        if (entry.isFile() && LOCK_FILES.has(entry.name)) {
            onEntry({ type: "lock", path: fullPath });
        }
    }
}

async function removePath(path) {
    await rm(path, { recursive: true, force: true });
}

async function main() {
    const nodeModulesPaths = [];
    const lockPaths = [];

    await walk(ROOT, (entry) => {
        if (entry.type === "node_modules") {
            nodeModulesPaths.push(entry.path);
            return;
        }

        lockPaths.push(entry.path);
    });

    for (const path of lockPaths) {
        await removePath(path);
        console.log(`deleted lock file: ${relative(ROOT, path)}`);
    }

    nodeModulesPaths.sort((a, b) => b.length - a.length);

    for (const path of nodeModulesPaths) {
        await removePath(path);
        console.log(`deleted node_modules: ${relative(ROOT, path)}`);
    }

    console.log(
        `\nDone. Removed ${lockPaths.length} lock file(s) and ${nodeModulesPaths.length} node_modules folder(s).`
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .then(() => {
        process.exit(0);
    });
