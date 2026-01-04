import createDebug from "debug";
import type { Compositions } from "./schema";

const debug = createDebug("dreamy-ui:dependencies");

export const findCompositionById = (compositions: Compositions, id: string) => {
    // Normalize the ID by removing common prefixes and extensions
    const normalizedId = id
        .replace(/^\.\//, "") // Remove ./ prefix
        .replace(/^compositions\/ui\//, "") // Remove compositions/ui/ prefix
        .replace(/\.(tsx|ts|jsx|js)$/, ""); // Remove file extension

    debug(`Looking for composition with ID: "${id}" (normalized: "${normalizedId}")`);

    const found = compositions.find((comp) => {
        const normalizedCompId = comp.id
            .replace(/^\.\//, "")
            .replace(/^compositions\/ui\//, "")
            .replace(/\.(tsx|ts|jsx|js)$/, "");

        return normalizedCompId === normalizedId;
    });

    if (found) {
        debug(
            `Found composition: "${found.id}" with ${found.fileDependencies.length} dependencies`
        );
    } else {
        debug(`No composition found for: "${id}" (normalized: "${normalizedId}")`);
        debug(`Available composition IDs: ${compositions.map((c) => c.id).join(", ")}`);
    }

    return found;
};

export const getFileDependencies = (compositions: Compositions, id: string) => {
    debug(`\n=== Getting file dependencies for: "${id}" ===`);
    const composition = findCompositionById(compositions, id);
    if (!composition) {
        debug(`Failed to find composition for "${id}"`);
        return [];
    }

    debug(`Initial dependencies for "${id}":`, composition.fileDependencies);

    const fileDependencies = new Set<string>();

    // Normalize dependency paths
    const normalizePath = (path: string) => {
        return path.replace(/^\.\//, "").replace(/^compositions\/ui\//, "");
    };

    composition.fileDependencies.forEach((dep) => {
        const normalized = normalizePath(dep);
        debug(`  Adding initial dependency: "${dep}" -> "${normalized}"`);
        fileDependencies.add(normalized);
    });

    const npmDependencies = new Set<string>(composition.npmDependencies || []);

    const collect = (depId: string, depth = 0) => {
        const indent = "  ".repeat(depth + 1);
        debug(`${indent}Collecting dependencies for: "${depId}"`);

        // findCompositionById now handles normalization
        const comp = findCompositionById(compositions, depId);
        if (!comp) {
            debug(`${indent}❌ Could not find composition for: "${depId}"`);
            return;
        }

        if (comp.npmDependencies) {
            comp.npmDependencies.forEach((dep) => {
                npmDependencies.add(dep);
            });
        }

        comp.fileDependencies.forEach((dep) => {
            const normalizedDep = normalizePath(dep);
            // Check with normalized path for proper deduplication
            if (fileDependencies.has(normalizedDep)) {
                debug(`${indent}⏭️  Skipping already processed: "${normalizedDep}"`);
                return;
            }
            debug(`${indent}✅ Adding dependency: "${dep}" -> "${normalizedDep}"`);
            fileDependencies.add(normalizedDep);
            // Recursively collect dependencies of this dependency
            collect(dep, depth + 1);
        });
    };

    collect(id);

    const result = Array.from(fileDependencies);
    const npmResult = Array.from(npmDependencies);
    debug(`\n=== Total file dependencies collected: ${result.length} ===`);
    debug(result);
    debug(`\n=== Total npm dependencies collected: ${npmResult.length} ===`);
    debug(npmResult);

    return {
        fileDependencies: result,
        npmDependencies: npmResult
    };
};
