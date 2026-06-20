import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join, normalize } from "node:path";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import chokidar from "chokidar";
import { main } from "./components";
import {
    REGISTRY_DIR,
    WEBSITE_DIR,
    getPatternsDirectory,
    getPublicDirectory,
    getRecipesDirectory,
    getUiDirectory
} from "./paths";

interface ComponentIndexItem {
    id: string;
    recipeIds?: string[];
    patternIds?: string[];
}

interface RegistryChange {
    kind: "component" | "recipe" | "pattern";
    id: string;
}

while (true) {
    try {
        execSync("curl -s http://localhost:3000");
        break;
    } catch {
        console.log("Waiting for localhost:3000 to be running...");
        await setTimeoutPromise(1000);
    }
}

setTimeout(() => {
    runAddAllComponents();
}, 250);

chokidar
    .watch([getUiDirectory(), getRecipesDirectory(), getPatternsDirectory()], {
        ignoreInitial: true
    })
    .on("change", async (filePath) => {
        console.log("filePath", filePath);
        const changed = parseRegistryChange(filePath);
        console.log("changed", changed);
        if (!changed) {
            return;
        }

        console.log(`🔄 Processing ${changed.kind}: ${changed.id}`);
        await main();
        await setTimeoutPromise(250);
        const affectedComponents = getAffectedComponents(changed);
        if (!affectedComponents.length) {
            console.log("ℹ️ No affected components detected; skipping add command");
            return;
        }
        runAddComponents(affectedComponents, changed.kind);
        console.log(
            `✅ Components synced (${affectedComponents.length ? affectedComponents.join(", ") : "none"})`
        );
    });

function parseRegistryChange(filePath: string): RegistryChange | null {
    const normalizedPath = normalize(filePath).replaceAll("\\", "/");
    const fileId = basename(normalizedPath, extname(normalizedPath));
    const registryPath = normalize(REGISTRY_DIR).replaceAll("\\", "/");

    if (normalizedPath.includes(`${registryPath}/ui/`)) {
        return { kind: "component", id: fileId };
    }

    if (normalizedPath.includes(`${registryPath}/recipes/`)) {
        return { kind: "recipe", id: fileId };
    }

    if (normalizedPath.includes(`${registryPath}/patterns/`)) {
        return { kind: "pattern", id: fileId };
    }

    return null;
}

function getAffectedComponents(change: RegistryChange): string[] {
    if (change.kind === "component") {
        return [change.id];
    }

    const componentIndexPath = join(getPublicDirectory(), "components", "index.json");
    if (!existsSync(componentIndexPath)) {
        return [];
    }

    const componentIndex = JSON.parse(
        readFileSync(componentIndexPath, "utf-8")
    ) as ComponentIndexItem[];

    if (change.kind === "recipe") {
        return componentIndex
            .filter((item) => item.recipeIds?.includes(change.id))
            .map((item) => item.id);
    }

    return componentIndex
        .filter((item) => item.patternIds?.includes(change.id))
        .map((item) => item.id);
}

function runAddComponents(componentIds: string[], changeKind: RegistryChange["kind"]) {
    const skipCodegen = changeKind === "component" ? " --skip-codegen" : "";
    const command = `pnpm dreamy add ${componentIds.join(" ")} --force --skip-install${skipCodegen}`;
    execSync(command, { stdio: "inherit", cwd: WEBSITE_DIR });
}

function runAddAllComponents() {
    execSync("pnpm dreamy add --all --force --skip-install", {
        stdio: "inherit",
        cwd: WEBSITE_DIR
    });
}
