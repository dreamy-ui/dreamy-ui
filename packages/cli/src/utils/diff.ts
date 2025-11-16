import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { globbySync } from "globby";

export interface ComponentDiff {
    id: string;
    hasChanges: boolean;
    type: "component" | "recipe" | "pattern";
    localPath: string;
}

/**
 * Scan a directory for component files and return their IDs
 */
export function scanLocalComponents(dir: string, jsx: boolean): string[] {
    if (!existsSync(dir)) {
        return [];
    }

    const pattern = jsx ? "*.jsx" : "*.tsx";
    const files = globbySync([pattern], {
        cwd: dir,
        absolute: false
    });

    return files.map((file) => file.replace(/\.(tsx|jsx)$/, ""));
}

/**
 * Scan a directory for recipe/pattern files and return their IDs
 */
export function scanLocalFiles(dir: string, jsx: boolean): Array<{ id: string; path: string }> {
    if (!existsSync(dir)) {
        return [];
    }

    const pattern = jsx ? "*.js" : "*.ts";
    const files = globbySync([pattern, "!index.*"], {
        cwd: dir,
        absolute: false
    });

    return files.map((file) => ({
        id: file.replace(/\.(ts|js)$/, ""),
        path: join(dir, file)
    }));
}

/**
 * Compare local file content with registry content
 */
export function compareContent(localPath: string, registryContent: string): boolean {
    if (!existsSync(localPath)) {
        return false;
    }

    const localContent = readFileSync(localPath, "utf-8");

    // Normalize content for comparison
    const normalizeContent = (content: string) => {
        return (
            content
                // Remove all whitespace
                .replace(/\s+/g, " ")
                // Normalize import paths
                .replace(/from ["']@\/components\/ui["']/g, 'from "."')
                .replace(/from ["']compositions\/ui["']/g, 'from "."')
                .replace(/from ["']@\/recipes["']/g, 'from "./recipes"')
                .replace(/from ["']@\/patterns["']/g, 'from "./patterns"')
                .trim()
        );
    };

    const normalizedLocal = normalizeContent(localContent);
    const normalizedRegistry = normalizeContent(registryContent);

    return normalizedLocal !== normalizedRegistry;
}

/**
 * Get the actual file content for comparison
 */
export function getLocalContent(localPath: string): string | null {
    if (!existsSync(localPath)) {
        return null;
    }
    return readFileSync(localPath, "utf-8");
}

/**
 * Normalize import paths in content
 */
function normalizeImports(content: string): string {
    return content
        .replace(/from ["']@\/components\/ui["']/g, 'from "."')
        .replace(/from ["']compositions\/ui["']/g, 'from "."')
        .replace(/from ["']@\/recipes["']/g, 'from "./recipes"')
        .replace(/from ["']@\/patterns["']/g, 'from "./patterns"');
}

/**
 * Generate a git-style diff between two strings
 */
export function generateDiff(oldContent: string, newContent: string, filename: string): string {
    // Normalize imports before comparison
    const normalizedOld = normalizeImports(oldContent);
    const normalizedNew = normalizeImports(newContent);

    const oldLines = normalizedOld.split("\n");
    const newLines = normalizedNew.split("\n");

    const diff: string[] = [];
    diff.push(`--- ${filename} (local)`);
    diff.push(`+++ ${filename} (registry)`);
    diff.push("");

    // Simple line-by-line diff
    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
        if (i >= oldLines.length) {
            // Only new lines remaining
            diff.push(`+ ${newLines[j]}`);
            j++;
        } else if (j >= newLines.length) {
            // Only old lines remaining
            diff.push(`- ${oldLines[i]}`);
            i++;
        } else if (oldLines[i] === newLines[j]) {
            // Lines match
            diff.push(`  ${oldLines[i]}`);
            i++;
            j++;
        } else {
            // Lines differ - find next match
            let foundMatch = false;

            // Look ahead in new content for matching line
            for (let k = j + 1; k < Math.min(j + 5, newLines.length); k++) {
                if (oldLines[i] === newLines[k]) {
                    // Found match in new - old line was removed, new lines added
                    for (let l = j; l < k; l++) {
                        diff.push(`+ ${newLines[l]}`);
                    }
                    diff.push(`  ${oldLines[i]}`);
                    j = k + 1;
                    i++;
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                // Look ahead in old content for matching line
                for (let k = i + 1; k < Math.min(i + 5, oldLines.length); k++) {
                    if (oldLines[k] === newLines[j]) {
                        // Found match in old - new line was removed, old lines added
                        for (let l = i; l < k; l++) {
                            diff.push(`- ${oldLines[l]}`);
                        }
                        diff.push(`  ${newLines[j]}`);
                        i = k + 1;
                        j++;
                        foundMatch = true;
                        break;
                    }
                }
            }

            if (!foundMatch) {
                // No match found nearby - treat as line replacement
                diff.push(`- ${oldLines[i]}`);
                diff.push(`+ ${newLines[j]}`);
                i++;
                j++;
            }
        }
    }

    return diff.join("\n");
}
