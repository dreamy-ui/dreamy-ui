import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const REGISTRY_DIR = join(__dirname, "..");
export const MONOREPO_ROOT = join(REGISTRY_DIR, "..");
export const WEBSITE_DIR = join(MONOREPO_ROOT, "website");

export function getUiDirectory() {
    return join(REGISTRY_DIR, "ui");
}

export function getRecipesDirectory() {
    return join(REGISTRY_DIR, "recipes");
}

export function getPatternsDirectory() {
    return join(REGISTRY_DIR, "patterns");
}

export function getPublicDirectory() {
    return join(WEBSITE_DIR, "public");
}
