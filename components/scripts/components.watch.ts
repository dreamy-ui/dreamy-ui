import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import chokidar from "chokidar";
import { main } from "./components";
import { REGISTRY_DIR, WEBSITE_DIR, getPublicDirectory } from "./paths";

interface ComponentIndexItem {
    id: string;
    recipeIds?: string[];
    patternIds?: string[];
}

interface RegistryChange {
    kind: "component" | "recipe" | "pattern";
    id: string;
}

function isRecipeFile(content: string) {
    return /defineRecipe|defineSlotRecipe/.test(content);
}

function isPatternFile(content: string) {
    return /definePattern/.test(content);
}

function shouldIgnorePath(watchedPath: string) {
    const relativePath = relative(REGISTRY_DIR, watchedPath).replaceAll("\\", "/");
    if (!relativePath || relativePath === ".") {
        return false;
    }

    if (relativePath === "package.json" || relativePath === "tsconfig.json") {
        return true;
    }

    if (relativePath === "scripts" || relativePath.startsWith("scripts/")) {
        return true;
    }

    if (relativePath === "node_modules" || relativePath.startsWith("node_modules/")) {
        return true;
    }

    return false;
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

// chokidar v4 no longer supports globs; watch the registry directory recursively
chokidar
    .watch(REGISTRY_DIR, {
        ignoreInitial: true,
        ignored: shouldIgnorePath,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 100
        }
    })
    .on("change", onRegistryFileEvent)
    .on("add", onRegistryFileEvent);

async function onRegistryFileEvent(filePath: string) {
    const changed = parseRegistryChange(filePath);
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
    console.log(`✅ Components synced (${affectedComponents.join(", ")})`);
}

function parseRegistryChange(filePath: string): RegistryChange | null {
    const relativePath = relative(REGISTRY_DIR, filePath).replaceAll("\\", "/");
    const segments = relativePath.split("/");

    if (segments.length !== 2 || relativePath.startsWith("..") || relativePath.startsWith("/")) {
        return null;
    }

    const [folderName, fileName] = segments;
    if (folderName === "scripts" || folderName === "node_modules") {
        return null;
    }

    const ext = extname(fileName);
    const fileId = basename(fileName, ext);

    if (ext === ".tsx" && fileName === "index.tsx") {
        return { kind: "component", id: folderName };
    }

    if (ext === ".ts") {
        const content = readFileSync(filePath, "utf-8");
        if (isRecipeFile(content)) {
            return { kind: "recipe", id: fileId };
        }
        if (isPatternFile(content)) {
            return { kind: "pattern", id: fileId };
        }
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
