import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const REGISTRY_DIR = join(__dirname, "..");
export const MONOREPO_ROOT = join(REGISTRY_DIR, "..");
export const WEBSITE_DIR = join(MONOREPO_ROOT, "website");

const EXCLUDED_DIRECTORIES = new Set(["scripts", "node_modules"]);

export function getComponentDirectories() {
    return readdirSync(REGISTRY_DIR, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isDirectory() &&
                !entry.name.startsWith(".") &&
                !EXCLUDED_DIRECTORIES.has(entry.name)
        )
        .map((entry) => join(REGISTRY_DIR, entry.name));
}

export function getPublicDirectory() {
    return join(WEBSITE_DIR, "public");
}
