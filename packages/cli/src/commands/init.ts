import { exec } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { promisify } from "node:util";
import * as p from "@clack/prompts";
import { Command } from "commander";
import { globbySync } from "globby";
import { detect } from "package-manager-detector";
import { installCommand, pandaCodegenCommand } from "../utils/codegen-command";
import { RECOMMENDED_COMPONENTS } from "../utils/components";
import { ensureDir } from "../utils/io";
import { installDreamyMcp } from "./add-mcp";
import { installDreamySkills } from "./add-skill";

const execAsync = promisify(exec);

interface FrameworkConfig {
    type: "react-router" | "nextjs" | "vite" | "tanstack" | null;
    cssPath: string;
    cssImportPath: string;
    providerPath: string;
    includePattern: string;
}

function isTanStackProject(cwd: string): boolean {
    if (existsSync(join(cwd, ".cta.json"))) {
        return true;
    }

    const packageJsonPath = join(cwd, "package.json");
    if (existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            if (deps["@tanstack/react-start"] || deps["@tanstack/solid-start"]) {
                return true;
            }
        } catch {
            // ignore invalid package.json
        }
    }

    const viteConfigFiles = globbySync(
        ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"],
        { cwd }
    );
    for (const file of viteConfigFiles) {
        const content = readFileSync(join(cwd, file), "utf-8");
        if (
            content.includes("tanstackStart") ||
            content.includes("@tanstack/react-start") ||
            content.includes("@tanstack/solid-start")
        ) {
            return true;
        }
    }

    return false;
}

async function detectFramework(cwd: string): Promise<FrameworkConfig | null> {
    const files = globbySync(["react-router.config.*", "next.config.*", "vite.config.*"], { cwd });

    // Detect React Router v7
    if (files.find((file) => file.startsWith("react-router.config"))) {
        return {
            type: "react-router",
            cssPath: "app/app.css",
            cssImportPath: "app/root.tsx",
            providerPath: "components/dreamy-provider.tsx",
            includePattern: "./app/**/*.{js,jsx,ts,tsx}"
        };
    }

    // Detect Next.js
    if (files.find((file) => file.startsWith("next.config"))) {
        const hasSrcDir = existsSync(join(cwd, "src"));
        return {
            type: "nextjs",
            cssPath: hasSrcDir ? "src/app/globals.css" : "app/globals.css",
            cssImportPath: hasSrcDir ? "src/app/layout.tsx" : "app/layout.tsx",
            providerPath: "components/dreamy-provider.tsx",
            includePattern: hasSrcDir ? "./src/**/*.{js,jsx,ts,tsx}" : "./app/**/*.{js,jsx,ts,tsx}"
        };
    }

    // Detect TanStack Start before generic Vite (both use vite.config)
    if (isTanStackProject(cwd)) {
        const hasSrcDir = existsSync(join(cwd, "src"));
        return {
            type: "tanstack",
            cssPath: hasSrcDir ? "src/styles.css" : "styles.css",
            cssImportPath: hasSrcDir ? "src/routes/__root.tsx" : "routes/__root.tsx",
            providerPath: "components/dreamy-provider.tsx",
            includePattern: hasSrcDir
                ? "./src/**/*.{js,jsx,ts,tsx}"
                : "./routes/**/*.{js,jsx,ts,tsx}"
        };
    }

    // Detect Vite
    if (files.find((file) => file.startsWith("vite.config"))) {
        const hasSrcDir = existsSync(join(cwd, "src"));
        return {
            type: "vite",
            cssPath: hasSrcDir ? "src/index.css" : "src/index.css",
            cssImportPath: hasSrcDir ? "src/main.tsx" : "src/main.tsx",
            providerPath: "components/dreamy-provider.tsx",
            includePattern: "./src/**/*.{js,jsx,ts,tsx}"
        };
    }

    return null;
}

async function installDependencies(cwd: string, _framework: FrameworkConfig) {
    const s = p.spinner();
    try {
        s.start("Installing Panda CSS dev dependencies...");
        await installCommand(["@pandacss/dev", "@pandacss/postcss", "@dreamy-ui/cli", "-D"], cwd);
        s.message("Installing Dreamy UI packages...");
        await installCommand(["@dreamy-ui/react", "@dreamy-ui/panda-preset", "motion"], cwd);
        s.stop("✓ Dependencies installed successfully");
        return true;
    } catch (error) {
        s.stop("✗ Failed to install dependencies");
        p.log.error(`${error instanceof Error ? error.message : String(error)}`);
        p.log.warn(
            "💡 You can manually install dependencies by running:\n" +
                `   ${await getPackageManagerCommand(cwd)} @pandacss/dev @pandacss/postcss -D\n` +
                `   ${await getPackageManagerCommand(cwd)} @dreamy-ui/react @dreamy-ui/panda-preset @dreamy-ui/cli motion`
        );
        return false;
    }
}

async function getPackageManagerCommand(cwd: string): Promise<string> {
    const res = await detect({ cwd });
    const agent = res?.agent?.split("@")[0] || "npm";

    const commands: Record<string, string> = {
        npm: "npm install",
        yarn: "yarn add",
        pnpm: "pnpm add",
        bun: "bun add"
    };

    return commands[agent] || "npm install";
}

async function createPandaConfig(cwd: string, framework: FrameworkConfig, isTypeScript: boolean) {
    try {
        const configFile = isTypeScript ? "panda.config.ts" : "panda.config.js";
        const configPath = join(cwd, configFile);

        if (existsSync(configPath)) {
            const shouldOverwrite = await p.confirm({
                message: `${configFile} already exists. Do you want to overwrite it?`,
                initialValue: false
            });

            if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
                p.log.warn(`⊘ Skipped ${configFile} creation`);
                return false;
            }
        }

        // Determine the import path for patterns and recipes based on framework
        const componentsImportPath = "./components";

        const configContent = isTypeScript
            ? `import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import { patterns } from "${componentsImportPath}/patterns";
import { recipes } from "${componentsImportPath}/recipes";

export default defineConfig({
    preflight: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "${framework.includePattern}"
    ],
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin()],
    patterns,
    theme: {
        extend: {
            recipes
        }
    },
    globalCss: {
        extend: {}
    },
    staticCss: {
        extend: {}
    }
});
`
            : `import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";
import { patterns } from "${componentsImportPath}/patterns";
import { recipes } from "${componentsImportPath}/recipes";

export default defineConfig({
    preflight: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "${framework.includePattern}"
    ],
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin()],
    patterns,
    theme: {
        extend: {
            recipes
        }
    },
    globalCss: {
        extend: {}
    },
    staticCss: {
        extend: {}
    }
});
`;

        await writeFile(configPath, configContent, "utf-8");
        p.log.success(`✓ Created ${configFile}`);
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to create panda.config: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            "💡 You can manually create panda.config.ts using the example from:\n" +
                "   https://dreamy-ui.com/docs/guide/installation"
        );
        return false;
    }
}

async function setupPostCSS(
    cwd: string,
    framework: FrameworkConfig,
    options: { skipConfirm?: boolean } = {}
) {
    try {
        // Next.js needs PostCSS config
        if (framework.type === "nextjs") {
            const postcssPath = join(cwd, "postcss.config.mjs");

            if (existsSync(postcssPath)) {
                const content = readFileSync(postcssPath, "utf-8");
                if (content.includes("@pandacss/postcss") && !content.includes("tailwindcss")) {
                    p.log.info("⊘ PostCSS already configured for Panda CSS");
                    return true;
                }

                if (!options.skipConfirm) {
                    const shouldUpdate = await p.confirm({
                        message:
                            "postcss.config.mjs exists but doesn't include Panda CSS. Update it?",
                        initialValue: true
                    });

                    if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                        p.log.warn("⊘ Skipped PostCSS configuration");
                        return false;
                    }
                }
            }

            const postcssContent = `export default {
    plugins: {
        "@pandacss/postcss": {}
    }
};
`;

            await writeFile(postcssPath, postcssContent, "utf-8");
            p.log.success("✓ Created postcss.config.mjs");
        }

        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to setup PostCSS: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            "💡 For Next.js, manually create postcss.config.mjs with:\n" +
                '   { "plugins": { "@pandacss/postcss": {} } }'
        );
        return false;
    }
}

async function updateViteConfig(
    cwd: string,
    framework: FrameworkConfig,
    options: { skipConfirm?: boolean } = {}
) {
    try {
        // Only for Vite, React Router, and TanStack Start
        if (
            framework.type !== "vite" &&
            framework.type !== "react-router" &&
            framework.type !== "tanstack"
        ) {
            return true;
        }

        const viteConfigFiles = globbySync(
            ["vite.config.ts", "vite.config.js", "vite.config.mts"],
            {
                cwd
            }
        );

        if (viteConfigFiles.length === 0) {
            p.log.warn("⚠ Could not find vite.config file to update");
            return false;
        }

        const viteConfigPath = join(cwd, viteConfigFiles[0]);
        let content = readFileSync(viteConfigPath, "utf-8");

        // Check if Panda plugin is already configured (look for pandacss in plugins array)
        const hasPandaPlugin =
            /plugins:\s*\[[^\]]*pandacss[^\]]*\]/.test(content) ||
            /plugins:\s*\[[^\]]*@pandacss\/dev\/postcss[^\]]*\]/.test(content);
        const hasTailwindPlugin =
            content.includes("@tailwindcss/vite") || /tailwindcss\(\)/.test(content);

        if (hasPandaPlugin && !hasTailwindPlugin) {
            p.log.info("⊘ Vite config already configured for Panda CSS");
            return true;
        }

        if (!options.skipConfirm) {
            const shouldUpdate = await p.confirm({
                message: "Update vite.config to use Panda CSS PostCSS plugin?",
                initialValue: true
            });

            if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                p.log.warn("⊘ Skipped vite.config update");
                p.log.info(
                    "💡 Manually add Panda CSS PostCSS plugin to your vite.config:\n" +
                        '   import pandacss from "@pandacss/dev/postcss";\n' +
                        "   css: { postcss: { plugins: [pandacss] } }"
                );
                return false;
            }
        }

        // Remove tailwindcss import and plugin
        content = content.replace(
            /import\s+tailwindcss\s+from\s+["']@tailwindcss\/vite["'];?\n?/g,
            ""
        );
        content = content.replace(/tailwindcss\(\)\s*,?\s*/g, "");

        // Add pandacss import if not present
        if (!content.includes("@pandacss/dev/postcss")) {
            // Find the first import statement
            const importMatch = content.match(/import\s+.*?from\s+["'].*?["'];?/);
            if (importMatch) {
                const insertPosition = content.indexOf(importMatch[0]);
                content =
                    content.slice(0, insertPosition) +
                    'import pandacss from "@pandacss/dev/postcss";\n' +
                    content.slice(insertPosition);
            } else {
                // No imports found, add at the beginning
                content = 'import pandacss from "@pandacss/dev/postcss";\n' + content;
            }
        }

        // Add or update css.postcss config
        const hasCssProperty = /css\s*:\s*\{/.test(content);

        if (hasCssProperty) {
            // css: {} exists, check if it has postcss with plugins array
            // Find postcss property and check if it has plugins nearby
            const postcssIndex = content.search(/postcss\s*:\s*\{/);
            const hasPostcssPlugins =
                postcssIndex !== -1 &&
                content.slice(postcssIndex).search(/plugins\s*:\s*\[/) !== -1;

            if (hasPostcssPlugins) {
                // postcss.plugins exists, add pandacss to the array if not already there
                const pluginsArrayMatch = content.match(/plugins\s*:\s*\[([^\]]*)\]/);
                if (pluginsArrayMatch) {
                    const pluginsContent = pluginsArrayMatch[1];
                    if (!pluginsContent.includes("pandacss")) {
                        // Add pandacss to the plugins array
                        const arrayStart = content.indexOf(pluginsArrayMatch[0]);
                        const pluginsStart =
                            arrayStart + content.slice(arrayStart).indexOf("[") + 1;
                        const insertPosition = pluginsStart + pluginsContent.trim().length;
                        const separator = pluginsContent.trim() ? ", " : "";
                        content =
                            content.slice(0, insertPosition) +
                            separator +
                            "pandacss" +
                            content.slice(insertPosition);
                    }
                } else {
                    // postcss exists but no plugins array, add it
                    const postcssMatch = content.match(/postcss\s*:\s*\{/);
                    if (postcssMatch) {
                        const postcssStart = content.indexOf(postcssMatch[0]);
                        const postcssBraceStart = postcssStart + postcssMatch[0].length - 1;
                        // Check if postcss object has content
                        const afterBrace = content.slice(postcssBraceStart + 1);
                        const nextBrace = afterBrace.indexOf("}");
                        const postcssContent = afterBrace.slice(0, nextBrace);
                        const needsComma =
                            postcssContent.trim().length > 0 &&
                            !postcssContent.trim().endsWith(",");
                        const insertPosition = postcssBraceStart + 1;
                        const pluginsConfig = `${needsComma ? ", " : ""}plugins: [pandacss]`;
                        content =
                            content.slice(0, insertPosition) +
                            pluginsConfig +
                            content.slice(insertPosition);
                    }
                }
            } else {
                // css exists but no postcss, add postcss.plugins
                const cssMatch = content.match(/css\s*:\s*\{/);
                if (cssMatch) {
                    const cssStart = content.indexOf(cssMatch[0]);
                    const cssBraceStart = cssStart + cssMatch[0].length - 1; // Position of '{'
                    // Find the content of css object to determine if we need a comma
                    const afterBrace = content.slice(cssBraceStart + 1);
                    // Find matching closing brace (simplified - just look for first } that's not inside nested objects)
                    let braceCount = 1;
                    let nextBracePos = -1;
                    for (let i = 0; i < afterBrace.length; i++) {
                        if (afterBrace[i] === "{") braceCount++;
                        if (afterBrace[i] === "}") braceCount--;
                        if (braceCount === 0) {
                            nextBracePos = i;
                            break;
                        }
                    }
                    const cssContent = nextBracePos > 0 ? afterBrace.slice(0, nextBracePos) : "";
                    const needsComma =
                        cssContent.trim().length > 0 && !cssContent.trim().endsWith(",");
                    const insertPosition = cssBraceStart + 1;
                    const postcssConfig = `${needsComma ? ", " : ""}postcss: { plugins: [pandacss] }`;
                    content =
                        content.slice(0, insertPosition) +
                        postcssConfig +
                        content.slice(insertPosition);
                }
            }
        } else {
            // css: {} doesn't exist, create it
            // Try to find defineConfig with object literal: defineConfig({...})
            const defineConfigObjectMatch = content.match(/defineConfig\s*\(\s*\{/);
            if (defineConfigObjectMatch) {
                const insertPosition =
                    content.indexOf(defineConfigObjectMatch[0]) + defineConfigObjectMatch[0].length;
                const cssConfig = `
    css: {
        postcss: {
            plugins: [pandacss]
        }
    },`;
                content =
                    content.slice(0, insertPosition) + cssConfig + content.slice(insertPosition);
            } else {
                // Try to find defineConfig with callback: defineConfig(cb => {...}) or defineConfig(async (cb) => {...})
                // Also handle: defineConfig(cb => ({...})) - implicit return with parentheses
                // Handle both: (cb) => and cb => (single param without parens)
                const defineConfigCallbackMatch = content.match(
                    /defineConfig\s*\(\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*(\{|\()/
                );
                if (defineConfigCallbackMatch) {
                    const callbackStart = content.indexOf(defineConfigCallbackMatch[0]);
                    const arrowIndex = content.indexOf("=>", callbackStart);
                    const isImplicitReturn = defineConfigCallbackMatch[1] === "(";

                    if (isImplicitReturn) {
                        // Handle implicit return: defineConfig(cb => ({...}))
                        // The match already found the opening paren, now find the brace inside it
                        const matchEnd = callbackStart + defineConfigCallbackMatch[0].length;
                        const braceInParen = content.indexOf("{", matchEnd);
                        if (braceInParen !== -1) {
                            const insertPosition = braceInParen + 1;
                            const cssConfig = `
        css: {
            postcss: {
                plugins: [pandacss]
            }
        },`;
                            content =
                                content.slice(0, insertPosition) +
                                cssConfig +
                                content.slice(insertPosition);
                        } else {
                            p.log.warn("⚠ Could not find config object in implicit return");
                            return false;
                        }
                    } else {
                        // Handle explicit return: defineConfig(cb => { return {...} })
                        const callbackBodyStart = arrowIndex + 2; // After '=>'
                        const firstBrace = content.indexOf("{", callbackBodyStart);

                        if (firstBrace === -1) {
                            p.log.warn("⚠ Could not find callback body");
                            return false;
                        }

                        // Look for a return statement in the callback
                        const callbackBody = content.slice(firstBrace);
                        const returnMatch = callbackBody.match(/return\s*\{/);

                        if (returnMatch) {
                            // Insert css config after the return statement's opening brace
                            const returnStart = firstBrace + callbackBody.indexOf(returnMatch[0]);
                            const insertPosition = returnStart + returnMatch[0].length;
                            const cssConfig = `
        css: {
            postcss: {
                plugins: [pandacss]
            }
        },`;
                            content =
                                content.slice(0, insertPosition) +
                                cssConfig +
                                content.slice(insertPosition);
                        } else {
                            // No return statement found, try to find the config object directly
                            // Look for the first opening brace after the callback arrow
                            const insertPosition = firstBrace + 1;
                            const cssConfig = `
        css: {
            postcss: {
                plugins: [pandacss]
            }
        },`;
                            content =
                                content.slice(0, insertPosition) +
                                cssConfig +
                                content.slice(insertPosition);
                        }
                    }
                } else {
                    // Could not detect defineConfig pattern
                    p.log.warn("⚠ Could not detect defineConfig pattern in vite.config");
                    p.log.info(
                        "💡 Manually add Panda CSS PostCSS plugin to your vite.config:\n" +
                            '   import pandacss from "@pandacss/dev/postcss";\n' +
                            "   css: { postcss: { plugins: [pandacss] } }"
                    );
                    return false;
                }
            }
        }

        await writeFile(viteConfigPath, content, "utf-8");
        p.log.success(`✓ Updated ${viteConfigFiles[0]} with Panda CSS PostCSS plugin`);
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to update vite.config: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            "💡 Manually add Panda CSS PostCSS plugin to your vite.config:\n" +
                '   import pandacss from "@pandacss/dev/postcss";\n' +
                "   css: { postcss: { plugins: [pandacss] } }"
        );
        return false;
    }
}

async function createCSSFile(
    cwd: string,
    framework: FrameworkConfig,
    options: { skipConfirm?: boolean } = {}
) {
    try {
        const cssPath = join(cwd, framework.cssPath);
        const cssDir = dirname(cssPath);

        ensureDir(cssDir);

        if (existsSync(cssPath)) {
            const content = readFileSync(cssPath, "utf-8");
            if (content.includes("@layer reset, base, tokens, recipes, utilities")) {
                p.log.info("⊘ CSS file already configured with Panda CSS layers");
                return true;
            }

            if (!options.skipConfirm) {
                const shouldUpdate = await p.confirm({
                    message: `${framework.cssPath} exists. Replace with Panda CSS layers?`,
                    initialValue: true
                });

                if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                    p.log.warn("⊘ Skipped CSS file update");
                    return false;
                }
            }

            // For Next.js / TanStack, replace all content with Panda CSS layers only
            // For other frameworks, prepend Panda CSS layers
            const cssContent = `@layer reset, base, tokens, recipes, utilities;
`;

            if (framework.type === "nextjs" || framework.type === "tanstack") {
                await writeFile(cssPath, cssContent, "utf-8");
                p.log.success(`✓ Replaced ${framework.cssPath} with Panda CSS layers`);
            } else {
                // Prepend for other frameworks
                const updatedContent = cssContent + "\n" + content;
                await writeFile(cssPath, updatedContent, "utf-8");
                p.log.success(`✓ Updated ${framework.cssPath} with Panda CSS layers`);
            }
        } else {
            const cssContent = `@layer reset, base, tokens, recipes, utilities;
`;
            await writeFile(cssPath, cssContent, "utf-8");
            p.log.success(`✓ Created ${framework.cssPath}`);
        }

        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to create CSS file: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            `💡 Manually create ${framework.cssPath} and add:\n` +
                "   @layer reset, base, tokens, recipes, utilities;"
        );
        return false;
    }
}

async function ensureCSSImport(
    cwd: string,
    framework: FrameworkConfig,
    options: { skipConfirm?: boolean } = {}
) {
    try {
        const importPath = join(cwd, framework.cssImportPath);

        if (!existsSync(importPath)) {
            p.log.warn(
                `⚠ Could not find ${framework.cssImportPath} to add CSS import automatically`
            );
            p.log.info(
                "💡 Please manually import the CSS file in your app entry point:\n" +
                    `   import "./${framework.cssPath.split("/").pop()}";`
            );
            return false;
        }

        const content = readFileSync(importPath, "utf-8");
        const cssFileName = framework.cssPath.split("/").pop();

        if (content.includes(cssFileName || "")) {
            p.log.info("⊘ CSS file is already imported");
            return true;
        }

        // TanStack Start loads CSS via `?url` head links — do not add a side-effect import
        if (framework.type === "tanstack") {
            p.log.info(
                "⊘ TanStack Start loads CSS via head links — ensure styles.css is linked in __root.tsx"
            );
            return true;
        }

        if (!options.skipConfirm) {
            const shouldUpdate = await p.confirm({
                message: `Add CSS import to ${framework.cssImportPath}?`,
                initialValue: true
            });

            if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                p.log.warn("⊘ Skipped CSS import");
                p.log.info(
                    `💡 Manually add this import to ${framework.cssImportPath}:\n` +
                        `   import "./${cssFileName}";`
                );
                return false;
            }
        }

        // Add import at the top of the file
        const importStatement = `import "./${cssFileName}";\n`;
        const updatedContent = importStatement + content;

        await writeFile(importPath, updatedContent, "utf-8");
        p.log.success(`✓ Added CSS import to ${framework.cssImportPath}`);
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to add CSS import: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            `💡 Manually add this import to ${framework.cssImportPath}:\n` +
                `   import "./${framework.cssPath.split("/").pop()}";`
        );
        return false;
    }
}

function detectTailwind(cwd: string, framework: FrameworkConfig): boolean {
    const cssPath = join(cwd, framework.cssPath);
    if (existsSync(cssPath)) {
        const css = readFileSync(cssPath, "utf-8");
        if (
            css.includes("@tailwind") ||
            css.includes("tailwindcss") ||
            /@import\s+["']tailwindcss["']/.test(css)
        ) {
            return true;
        }
    }

    const viteConfigFiles = globbySync(["vite.config.ts", "vite.config.js", "vite.config.mts"], {
        cwd
    });
    for (const file of viteConfigFiles) {
        const content = readFileSync(join(cwd, file), "utf-8");
        if (content.includes("tailwindcss") || content.includes("@tailwindcss")) {
            return true;
        }
    }

    const postcssFiles = globbySync(["postcss.config.*"], { cwd });
    for (const file of postcssFiles) {
        const content = readFileSync(join(cwd, file), "utf-8");
        if (content.includes("tailwindcss")) {
            return true;
        }
    }

    const packageJsonPath = join(cwd, "package.json");
    if (existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            if (
                deps.tailwindcss ||
                deps["@tailwindcss/vite"] ||
                deps["@tailwindcss/postcss"]
            ) {
                return true;
            }
        } catch {
            // ignore invalid package.json
        }
    }

    return false;
}

async function replaceTailwindWithDreamy(
    cwd: string,
    framework: FrameworkConfig,
    useDefaults: boolean
): Promise<boolean> {
    const shouldReplace = useDefaults
        ? true
        : await p.confirm({
              message: "Tailwind CSS detected. Replace it with Dreamy UI and Panda CSS?",
              initialValue: true
          });

    if (p.isCancel(shouldReplace) || !shouldReplace) {
        p.log.warn("⊘ Skipped Tailwind CSS replacement");
        return false;
    }

    const cssPath = join(cwd, framework.cssPath);
    ensureDir(dirname(cssPath));

    const cssContent = `@layer reset, base, tokens, recipes, utilities;
`;
    await writeFile(cssPath, cssContent, "utf-8");
    p.log.success(`✓ Replaced ${framework.cssPath} with Panda CSS layers`);

    // Keep the existing CSS import in the root/entry file — do not prompt.
    // Only add the import silently if it is somehow missing.
    await ensureCSSImport(cwd, framework, { skipConfirm: true });

    if (framework.type === "nextjs") {
        await setupPostCSS(cwd, framework, { skipConfirm: true });
    } else {
        await updateViteConfig(cwd, framework, { skipConfirm: true });
    }

    return true;
}

async function createDreamyProvider(
    cwd: string,
    framework: FrameworkConfig,
    isTypeScript: boolean
) {
    try {
        const providerDir = dirname(join(cwd, framework.providerPath));
        ensureDir(providerDir);

        const providerPath = join(cwd, framework.providerPath);

        if (existsSync(providerPath)) {
            p.log.info("⊘ DreamyProvider file already exists");
            return true;
        }

        const ext = isTypeScript ? "tsx" : "jsx";
        const finalProviderPath = providerPath.replace(/\.tsx$/, `.${ext}`);

        let providerContent = "";

        if (framework.type === "react-router" || framework.type === "tanstack") {
            providerContent = isTypeScript
                ? `"use client";

import { DreamyProvider as BaseDreamyProvider, type ColorMode } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: ColorMode;
}

export function DreamyProvider({ children, colorMode }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider
            motionFeatures={domMax}
            colorMode={colorMode}
            motionStrict
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}

export { getColorModeHTMLProps, getSSRColorMode };
`
                : `"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

export function DreamyProvider({ children, colorMode }) {
    return (
        <BaseDreamyProvider
            motionFeatures={domMax}
            colorMode={colorMode}
            motionStrict
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}

export { getColorModeHTMLProps, getSSRColorMode };
`;
        } else if (framework.type === "nextjs") {
            providerContent = isTypeScript
                ? `"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import type { ColorMode } from "@dreamy-ui/react";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: ColorMode;
}

export function DreamyProvider({ children, colorMode }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider 
            motionFeatures={domMax} 
            motionStrict
            colorMode={colorMode}
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}
`
                : `"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

export function DreamyProvider({ children, colorMode }) {
    return (
        <BaseDreamyProvider 
            motionFeatures={domMax} 
            motionStrict
            colorMode={colorMode}
            useUserPreferenceColorMode
        >
            {children}
        </BaseDreamyProvider>
    );
}
`;
        } else {
            // Vite
            providerContent = isTypeScript
                ? `import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import domMax from "motion/react";

interface DreamyProviderProps {
    children: React.ReactNode;
}

export function DreamyProvider({ children }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider motionFeatures={domMax}>
            {children}
        </BaseDreamyProvider>
    );
}
`
                : `import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import domMax from "motion/react";

export function DreamyProvider({ children }) {
    return (
        <BaseDreamyProvider motionFeatures={domMax}>
            {children}
        </BaseDreamyProvider>
    );
}
`;
        }

        await writeFile(finalProviderPath, providerContent, "utf-8");
        p.log.success(`✓ Created ${framework.providerPath}`);
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to create DreamyProvider: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            "💡 You can manually create the DreamyProvider component using the example from:\n" +
                "   https://dreamy-ui.com/docs/guide/installation"
        );
        return false;
    }
}

function stripJsonComments(value: string) {
    return value
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
}

async function updateTsConfig(cwd: string) {
    try {
        const tsconfigPath = join(cwd, "tsconfig.json");

        if (!existsSync(tsconfigPath)) {
            p.log.info("⊘ No tsconfig.json found, skipping TypeScript configuration");
            return true;
        }

        const content = readFileSync(tsconfigPath, "utf-8");
        const tsconfig = JSON.parse(stripJsonComments(content));

        let needsUpdate = false;

        // Add styled-system to include
        if (!content.includes("styled-system")) {
            const shouldUpdate = await p.confirm({
                message: "Add styled-system to tsconfig.json include?",
                initialValue: true
            });

            if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                p.log.warn("⊘ Skipped tsconfig.json update");
                p.log.info(
                    '💡 Manually add "styled-system/**/*" to the "include" array in tsconfig.json'
                );
                return false;
            }

            if (!tsconfig.include) {
                tsconfig.include = [];
            }
            tsconfig.include.push("styled-system/**/*");
            needsUpdate = true;
        }

        // Add path aliases
        const componentsPath = "./components/ui/index";

        if (!tsconfig.compilerOptions) {
            tsconfig.compilerOptions = {};
        }
        if (!tsconfig.compilerOptions.paths) {
            tsconfig.compilerOptions.paths = {};
        }

        // Ensure @/ui is the first path alias (points to the components index)
        const existingPaths = tsconfig.compilerOptions.paths;
        const hasUiPath = "@/ui" in existingPaths;

        if (!hasUiPath) {
            const shouldAddUiPath = await p.confirm({
                message: "Add @/ui path alias to tsconfig.json?",
                initialValue: true
            });

            if (p.isCancel(shouldAddUiPath) || !shouldAddUiPath) {
                p.log.warn("⊘ Skipped @/ui path alias");
                p.log.info(
                    '💡 Manually add "@/ui": ["./components/ui/index"] to the "paths" object in tsconfig.json compilerOptions'
                );
                // Continue with other updates (styled-system, etc.)
            } else {
                // Drop legacy @/ui/* if present, then put @/ui first
                const pathsWithoutUi = Object.keys(existingPaths).reduce(
                    (acc, key) => {
                        if (key !== "@/ui" && key !== "@/ui/*") {
                            acc[key] = existingPaths[key];
                        }
                        return acc;
                    },
                    {} as Record<string, string[]>
                );

                tsconfig.compilerOptions.paths = {
                    "@/ui": [componentsPath],
                    ...pathsWithoutUi
                };
                needsUpdate = true;
            }
        } else {
            // Path already exists, just ensure it's first
            const firstKey = Object.keys(existingPaths)[0];
            const needsReorder = firstKey !== "@/ui";

            if (needsReorder) {
                const pathsWithoutUi = Object.keys(existingPaths).reduce(
                    (acc, key) => {
                        if (key !== "@/ui" && key !== "@/ui/*") {
                            acc[key] = existingPaths[key];
                        }
                        return acc;
                    },
                    {} as Record<string, string[]>
                );

                tsconfig.compilerOptions.paths = {
                    "@/ui": existingPaths["@/ui"],
                    ...pathsWithoutUi
                };
                needsUpdate = true;
            }
        }

        // Add styled-system/* path alias (needed for type resolution)
        if (!tsconfig.compilerOptions.paths["styled-system/*"]) {
            tsconfig.compilerOptions.paths["styled-system/*"] = ["./styled-system/*"];
            needsUpdate = true;
        }

        if (needsUpdate) {
            await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf-8");
            p.log.success(
                "✓ Updated tsconfig.json with styled-system include, styled-system/* path, and @/ui path alias"
            );
        } else {
            p.log.info("⊘ tsconfig.json already configured");
        }

        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to update tsconfig.json: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            '💡 Manually add "styled-system/**/*" to the "include" array and "@/ui" / "styled-system/*" path aliases in tsconfig.json'
        );
        return false;
    }
}

async function updatePackageJson(cwd: string) {
    try {
        const packageJsonPath = join(cwd, "package.json");

        if (!existsSync(packageJsonPath)) {
            p.log.warn("⚠ Could not find package.json to add prepare script");
            p.log.info(
                "💡 Manually add this script to your package.json:\n" +
                    '   "prepare": "panda codegen"'
            );
            return false;
        }

        const content = readFileSync(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(content);

        // Check if prepare script already exists
        if (packageJson.scripts?.prepare) {
            // If it already contains "panda codegen", skip
            if (packageJson.scripts.prepare.includes("panda codegen")) {
                p.log.info("⊘ prepare script already configured with panda codegen");
                return true;
            }

            // If it exists but doesn't contain panda codegen, ask to update
            const shouldUpdate = await p.confirm({
                message: "prepare script exists but doesn't include 'panda codegen'. Update it?",
                initialValue: true
            });

            if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                p.log.warn("⊘ Skipped package.json prepare script update");
                p.log.info(
                    "💡 Manually add 'panda codegen' to your prepare script in package.json"
                );
                return false;
            }

            // Append panda codegen to existing prepare script
            packageJson.scripts.prepare = `${packageJson.scripts.prepare} && panda codegen`;
        } else {
            // Create scripts object if it doesn't exist
            if (!packageJson.scripts) {
                packageJson.scripts = {};
            }

            // Add prepare script
            packageJson.scripts.prepare = "panda codegen";
        }

        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
        p.log.success("✓ Added prepare script to package.json");
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to update package.json: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn(
            "💡 Manually add this script to your package.json:\n" + '   "prepare": "panda codegen"'
        );
        return false;
    }
}

async function runPandaCodegen(cwd: string) {
    const s = p.spinner();
    try {
        s.start("Running Panda CSS codegen...");
        await pandaCodegenCommand(cwd);
        s.stop("✓ Panda CSS codegen completed");
        return true;
    } catch (error) {
        s.stop("✗ Failed to run Panda codegen");
        p.log.error(`${error instanceof Error ? error.message : String(error)}`);
        p.log.warn("💡 You can manually run Panda codegen:\n" + "   npx panda codegen");
        return false;
    }
}

async function addDefaultComponents(cwd: string) {
    const s = p.spinner();
    try {
        s.start(`Adding recommended components (${RECOMMENDED_COMPONENTS.join(", ")})...`);

        // Use the dreamy CLI to add components
        const res = await detect({ cwd });
        const agent = res?.agent?.split("@")[0] || "npm";

        const commandMap: Record<string, string> = {
            npm: "npx",
            yarn: "yarn",
            pnpm: "pnpm",
            bun: "bunx"
        };

        const runner = commandMap[agent] || "npx";
        const command = `${runner} dreamy add ${RECOMMENDED_COMPONENTS.join(" ")}`;

        await execAsync(command, { cwd, encoding: "utf-8" });
        s.stop("✓ Recommended components added");
        return true;
    } catch (error) {
        s.stop("⚠ Failed to add recommended components");
        p.log.error(`${error instanceof Error ? error.message : String(error)}`);
        p.log.info(
            `💡 You can manually add components later:\n   npx dreamy add ${RECOMMENDED_COMPONENTS.join(" ")}`
        );
        return false;
    }
}

function getProviderImportPath(cwd: string, rootPath: string, providerPath: string) {
    const absoluteRootPath = join(cwd, rootPath);
    const absoluteProviderPath = join(cwd, providerPath);
    const importPath = relative(dirname(absoluteRootPath), absoluteProviderPath)
        .replaceAll("\\", "/")
        .replace(/\.(jsx|tsx)$/, "");

    return importPath.startsWith(".") ? importPath : `./${importPath}`;
}

function prependImport(content: string, importStatement: string, importedName: string) {
    if (content.includes(importedName)) {
        return content;
    }

    return `${importStatement}\n${content}`;
}

function findFunctionBodyStart(content: string, functionName: string) {
    const functionIndex = content.indexOf(`function ${functionName}`);
    if (functionIndex === -1) {
        return -1;
    }

    const parametersStart = content.indexOf("(", functionIndex);
    if (parametersStart === -1) {
        return -1;
    }

    let parentheses = 0;
    for (let index = parametersStart; index < content.length; index++) {
        if (content[index] === "(") {
            parentheses++;
        } else if (content[index] === ")") {
            parentheses--;
            if (parentheses === 0) {
                return content.indexOf("{", index);
            }
        }
    }

    return -1;
}

function addColorModeToReactRouterRoot(
    content: string,
    providerImportPath: string,
    isTypeScript: boolean
) {
    if (
        !content.includes("<html") ||
        !content.includes("{children}") ||
        findFunctionBodyStart(content, "Layout") === -1
    ) {
        return null;
    }

    let updatedContent = content;

    updatedContent = prependImport(
        updatedContent,
        `import { DreamyProvider } from "${providerImportPath}";`,
        "DreamyProvider"
    );
    updatedContent = prependImport(
        updatedContent,
        `import { getColorModeHTMLProps } from "${providerImportPath}";`,
        "getColorModeHTMLProps"
    );
    updatedContent = prependImport(
        updatedContent,
        `import { getSSRColorMode } from "${providerImportPath}";`,
        "getSSRColorMode"
    );
    updatedContent = prependImport(
        updatedContent,
        'import { useRouteLoaderData } from "react-router";',
        "useRouteLoaderData"
    );

    if (isTypeScript) {
        updatedContent = prependImport(
            updatedContent,
            'import type { Route } from "./+types/root";',
            'from "./+types/root"'
        );
    }

    if (!updatedContent.includes("getSSRColorMode(request)")) {
        const loaderBodyStart = findFunctionBodyStart(updatedContent, "loader");

        if (loaderBodyStart === -1) {
            const layoutIndex = updatedContent.indexOf("export function Layout");
            if (layoutIndex === -1) {
                return null;
            }
            const loader = isTypeScript
                ? "export function loader({ request }: Route.LoaderArgs) {\n    return { colorMode: getSSRColorMode(request) };\n}\n\n"
                : "export function loader({ request }) {\n    return { colorMode: getSSRColorMode(request) };\n}\n\n";
            updatedContent =
                updatedContent.slice(0, layoutIndex) + loader + updatedContent.slice(layoutIndex);
        } else {
            const loaderSignature = updatedContent.slice(
                updatedContent.lastIndexOf("function loader", loaderBodyStart),
                loaderBodyStart
            );
            const returnIndex = updatedContent.indexOf("return", loaderBodyStart);
            const returnObjectStart =
                returnIndex === -1 ? -1 : updatedContent.indexOf("{", returnIndex);
            const returnPrefix =
                returnIndex === -1 || returnObjectStart === -1
                    ? ""
                    : updatedContent.slice(returnIndex + "return".length, returnObjectStart);

            if (
                !loaderSignature.includes("request") ||
                returnObjectStart === -1 ||
                returnPrefix.trim()
            ) {
                return null;
            }

            updatedContent =
                updatedContent.slice(0, returnObjectStart + 1) +
                "\n        colorMode: getSSRColorMode(request)," +
                updatedContent.slice(returnObjectStart + 1);
        }
    }

    const layoutBodyStart = findFunctionBodyStart(updatedContent, "Layout");
    if (
        !updatedContent.includes('useRouteLoaderData<Route.ComponentProps["loaderData"]>("root")')
    ) {
        const loaderData = isTypeScript
            ? '\n    const { colorMode } = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root") ?? {};\n'
            : '\n    const { colorMode } = useRouteLoaderData("root") ?? {};\n';
        updatedContent =
            updatedContent.slice(0, layoutBodyStart + 1) +
            loaderData +
            updatedContent.slice(layoutBodyStart + 1);
    }

    if (!updatedContent.includes("{...getColorModeHTMLProps(colorMode)}")) {
        updatedContent = updatedContent.replace(
            "<html",
            "<html {...getColorModeHTMLProps(colorMode)}"
        );
    }

    if (!updatedContent.includes("<DreamyProvider colorMode={colorMode}>")) {
        const childrenIndex = updatedContent.indexOf("{children}", layoutBodyStart);
        if (childrenIndex === -1) {
            return null;
        }
        updatedContent =
            updatedContent.slice(0, childrenIndex) +
            "<DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>" +
            updatedContent.slice(childrenIndex + "{children}".length);
    }

    return updatedContent;
}

function addColorModeToNextRoot(content: string, providerImportPath: string) {
    const rootLayoutBodyStart = findFunctionBodyStart(content, "RootLayout");
    if (
        rootLayoutBodyStart === -1 ||
        !content.includes("<html") ||
        !content.includes("{children}")
    ) {
        return null;
    }

    let updatedContent = content;
    updatedContent = prependImport(
        updatedContent,
        `import { DreamyProvider } from "${providerImportPath}";`,
        providerImportPath
    );
    updatedContent = prependImport(
        updatedContent,
        'import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";',
        "getColorModeHTMLProps"
    );
    updatedContent = prependImport(
        updatedContent,
        'import { cookies } from "next/headers";',
        'from "next/headers"'
    );

    if (!/export\s+default\s+async\s+function\s+RootLayout/.test(updatedContent)) {
        updatedContent = updatedContent.replace(
            /export\s+default\s+function\s+RootLayout/,
            "export default async function RootLayout"
        );
    }

    const updatedRootLayoutBodyStart = findFunctionBodyStart(updatedContent, "RootLayout");
    if (!updatedContent.includes("getSSRColorMode((await cookies()).toString())")) {
        updatedContent =
            updatedContent.slice(0, updatedRootLayoutBodyStart + 1) +
            "\n    const colorMode = getSSRColorMode((await cookies()).toString());\n" +
            updatedContent.slice(updatedRootLayoutBodyStart + 1);
    }

    if (!updatedContent.includes("{...getColorModeHTMLProps(colorMode)}")) {
        updatedContent = updatedContent.replace(
            "<html",
            "<html {...getColorModeHTMLProps(colorMode)}"
        );
    }

    if (!updatedContent.includes("<DreamyProvider colorMode={colorMode}>")) {
        const childrenIndex = updatedContent.indexOf("{children}", updatedRootLayoutBodyStart);
        if (childrenIndex === -1) {
            return null;
        }
        updatedContent =
            updatedContent.slice(0, childrenIndex) +
            "<DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>" +
            updatedContent.slice(childrenIndex + "{children}".length);
    }

    return updatedContent;
}

function addColorModeToTanStackRoot(content: string, providerImportPath: string) {
    if (!content.includes("createRootRoute") || !content.includes("shellComponent")) {
        return null;
    }

    let updatedContent = content;

    updatedContent = prependImport(
        updatedContent,
        `import { DreamyProvider, getColorModeHTMLProps, getSSRColorMode } from "${providerImportPath}";`,
        "DreamyProvider"
    );
    updatedContent = prependImport(
        updatedContent,
        'import { createServerFn } from "@tanstack/react-start";',
        "createServerFn"
    );
    updatedContent = prependImport(
        updatedContent,
        'import { getRequest } from "@tanstack/react-start/server";',
        "getRequest"
    );

    if (!updatedContent.includes("getSSRColorMode(getRequest())")) {
        const routeExportIndex = updatedContent.indexOf("export const Route");
        if (routeExportIndex === -1) {
            return null;
        }

        const colorModeServerFn = `const getColorMode = createServerFn({ method: "GET" }).handler(async () => {
  return getSSRColorMode(getRequest());
});

`;
        updatedContent =
            updatedContent.slice(0, routeExportIndex) +
            colorModeServerFn +
            updatedContent.slice(routeExportIndex);
    }

    if (!updatedContent.includes("beforeLoad:")) {
        updatedContent = updatedContent.replace(
            /createRootRoute\(\{\s*\n/,
            `createRootRoute({
  beforeLoad: async () => {
    const colorMode = await getColorMode();
    return { colorMode };
  },
`
        );
    } else if (!updatedContent.includes("await getColorMode()")) {
        // beforeLoad already exists — try to inject colorMode into its return
        const beforeLoadMatch = updatedContent.match(/beforeLoad:\s*async\s*\([^)]*\)\s*=>\s*\{/);
        if (!beforeLoadMatch) {
            return null;
        }
        const insertAt = updatedContent.indexOf(beforeLoadMatch[0]) + beforeLoadMatch[0].length;
        updatedContent =
            updatedContent.slice(0, insertAt) +
            "\n    const colorMode = await getColorMode();\n" +
            updatedContent.slice(insertAt);

        const returnObjectMatch = updatedContent
            .slice(insertAt)
            .match(/return\s*(\{)/);
        if (returnObjectMatch && returnObjectMatch.index != null) {
            const returnBrace =
                insertAt + returnObjectMatch.index + returnObjectMatch[0].length - 1;
            updatedContent =
                updatedContent.slice(0, returnBrace + 1) +
                "\n      colorMode," +
                updatedContent.slice(returnBrace + 1);
        }
    }

    const rootDocumentMatch = updatedContent.match(
        /function\s+RootDocument\s*\(\s*\{\s*children\s*\}[^)]*\)\s*\{/
    );
    if (!rootDocumentMatch) {
        return null;
    }

    const rootDocumentBodyStart =
        updatedContent.indexOf(rootDocumentMatch[0]) + rootDocumentMatch[0].length;

    if (!updatedContent.includes("Route.useRouteContext()")) {
        updatedContent =
            updatedContent.slice(0, rootDocumentBodyStart) +
            "\n  const { colorMode } = Route.useRouteContext();\n" +
            updatedContent.slice(rootDocumentBodyStart);
    }

    if (!updatedContent.includes("{...getColorModeHTMLProps(colorMode)}")) {
        updatedContent = updatedContent.replace(
            /<html([^>]*)>/,
            "<html$1 {...getColorModeHTMLProps(colorMode)}>"
        );
    }

    // Remove TanStack starter theme bootstrap script — Dreamy handles color mode
    updatedContent = updatedContent.replace(
        /\s*<script\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*THEME_INIT_SCRIPT\s*\}\}\s*\/>\s*/g,
        "\n        "
    );
    updatedContent = updatedContent.replace(/const THEME_INIT_SCRIPT = `[\s\S]*?`;\n?/g, "");

    if (!updatedContent.includes("<DreamyProvider colorMode={colorMode}>")) {
        // Prefer wrapping the full body contents; fall back to wrapping {children}
        if (
            updatedContent.includes("<body") &&
            updatedContent.includes("</body>") &&
            !updatedContent.includes("<DreamyProvider")
        ) {
            updatedContent = updatedContent.replace(/<body([^>]*)>/, "<body$1>\n        <DreamyProvider colorMode={colorMode}>");
            updatedContent = updatedContent.replace(
                /<\/body>/,
                "        </DreamyProvider>\n      </body>"
            );
        } else {
            const childrenIndex = updatedContent.indexOf("{children}", rootDocumentBodyStart);
            if (childrenIndex === -1) {
                return null;
            }
            updatedContent =
                updatedContent.slice(0, childrenIndex) +
                "<DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>" +
                updatedContent.slice(childrenIndex + "{children}".length);
        }
    }

    return updatedContent;
}

function addProviderToViteRoot(content: string, providerImportPath: string) {
    const appMatch = content.match(/<App\s*\/>/);
    if (!appMatch) {
        return null;
    }

    let updatedContent = prependImport(
        content,
        `import { DreamyProvider } from "${providerImportPath}";`,
        providerImportPath
    );

    if (!updatedContent.includes("<DreamyProvider>")) {
        updatedContent = updatedContent.replace(
            /<App\s*\/>/,
            "<DreamyProvider>\n            <App />\n        </DreamyProvider>"
        );
    }

    return updatedContent;
}

async function configureAppRoot(
    cwd: string,
    framework: FrameworkConfig,
    isTypeScript: boolean,
    useDefaults: boolean
) {
    const rootPath = framework.cssImportPath;
    const absoluteRootPath = join(cwd, rootPath);

    if (!existsSync(absoluteRootPath)) {
        p.log.warn(`⚠ Could not find ${rootPath} to configure DreamyProvider`);
        printNextSteps(cwd, framework);
        return false;
    }

    const currentContent = readFileSync(absoluteRootPath, "utf-8");
    if (currentContent.includes("<DreamyProvider")) {
        p.log.info(`⊘ ${rootPath} already uses DreamyProvider`);
        return true;
    }

    const shouldConfigure = useDefaults
        ? true
        : await p.confirm({
              message: `Update ${rootPath} to use DreamyProvider?`,
              initialValue: true
          });

    if (p.isCancel(shouldConfigure) || !shouldConfigure) {
        p.log.warn(`⊘ Skipped DreamyProvider setup in ${rootPath}`);
        printNextSteps(cwd, framework);
        return false;
    }

    try {
        const providerImportPath = getProviderImportPath(cwd, rootPath, framework.providerPath);
        let updatedContent: string | null;

        if (framework.type === "react-router") {
            updatedContent = addColorModeToReactRouterRoot(
                currentContent,
                providerImportPath,
                isTypeScript
            );
        } else if (framework.type === "nextjs") {
            updatedContent = addColorModeToNextRoot(currentContent, providerImportPath);
        } else if (framework.type === "tanstack") {
            updatedContent = addColorModeToTanStackRoot(currentContent, providerImportPath);
        } else {
            updatedContent = addProviderToViteRoot(currentContent, providerImportPath);
        }

        if (!updatedContent) {
            p.log.warn(`⚠ Could not safely update ${rootPath} automatically`);
            printNextSteps(cwd, framework);
            return false;
        }

        await writeFile(absoluteRootPath, updatedContent, "utf-8");
        p.log.success(`✓ Updated ${rootPath} with DreamyProvider`);
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to update ${rootPath}: ${error instanceof Error ? error.message : String(error)}`
        );
        printNextSteps(cwd, framework);
        return false;
    }
}

function printNextSteps(cwd: string, framework: FrameworkConfig) {
    const providerImportPath = getProviderImportPath(
        cwd,
        framework.cssImportPath,
        framework.providerPath
    );

    p.log.info("\n📋 Next Steps:");
    p.log.info("━".repeat(50));

    if (framework.type === "react-router") {
        p.log.info(
            "1. Update your app/root.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider, getColorModeHTMLProps, getSSRColorMode } from "${providerImportPath}";\n` +
                '   import type { Route } from "./+types/root";\n' +
                '   import { useRouteLoaderData } from "react-router";\n\n' +
                "   export function loader({ request }: Route.LoaderArgs) {\n" +
                "       return { colorMode: getSSRColorMode(request) };\n" +
                "   }\n\n" +
                "   export function Layout({ children }: { children: React.ReactNode }) {\n" +
                '       const { colorMode } = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root") ?? {};\n' +
                "       return (\n" +
                '           <html lang="en" {...getColorModeHTMLProps(colorMode)}>\n' +
                "               <head>\n" +
                '                   <meta charSet="utf-8" />\n' +
                '                   <meta content="width=device-width, initial-scale=1" name="viewport" />\n' +
                "                   <Meta />\n" +
                "                   <Links />\n" +
                "               </head>\n" +
                "               <body>\n" +
                "                   <DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>\n" +
                "                   <ScrollRestoration />\n" +
                "                   <Scripts />\n" +
                "               </body>\n" +
                "           </html>\n" +
                "       );\n" +
                "   }\n"
        );
    } else if (framework.type === "tanstack") {
        p.log.info(
            "1. Update your src/routes/__root.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider, getColorModeHTMLProps, getSSRColorMode } from "${providerImportPath}";\n` +
                '   import { createServerFn } from "@tanstack/react-start";\n' +
                '   import { getRequest } from "@tanstack/react-start/server";\n' +
                '   import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";\n' +
                '   import appCss from "../styles.css?url";\n\n' +
                '   const getColorMode = createServerFn({ method: "GET" }).handler(async () => {\n' +
                "       return getSSRColorMode(getRequest());\n" +
                "   });\n\n" +
                "   export const Route = createRootRoute({\n" +
                "       beforeLoad: async () => {\n" +
                "           const colorMode = await getColorMode();\n" +
                "           return { colorMode };\n" +
                "       },\n" +
                "       head: () => ({\n" +
                '           links: [{ rel: "stylesheet", href: appCss }]\n' +
                "       }),\n" +
                "       shellComponent: RootDocument\n" +
                "   });\n\n" +
                "   function RootDocument({ children }: { children: React.ReactNode }) {\n" +
                "       const { colorMode } = Route.useRouteContext();\n" +
                "       return (\n" +
                '           <html lang="en" {...getColorModeHTMLProps(colorMode)}>\n' +
                "               <head>\n" +
                "                   <HeadContent />\n" +
                "               </head>\n" +
                "               <body>\n" +
                "                   <DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>\n" +
                "                   <Scripts />\n" +
                "               </body>\n" +
                "           </html>\n" +
                "       );\n" +
                "   }\n"
        );
    } else if (framework.type === "nextjs") {
        p.log.info(
            "1. Update your app/layout.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider } from "${providerImportPath}";\n` +
                '   import { getSSRColorMode, getColorModeHTMLProps } from "@dreamy-ui/react/rsc";\n' +
                '   import { cookies } from "next/headers";\n\n' +
                "   export default async function RootLayout({\n" +
                "       children,\n" +
                "   }: Readonly<{\n" +
                "       children: React.ReactNode;\n" +
                "   }>) {\n" +
                "       const colorMode = getSSRColorMode((await cookies()).toString());\n\n" +
                "       return (\n" +
                '           <html lang="en" {...getColorModeHTMLProps(colorMode)}>\n' +
                "               <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>\n" +
                "                   <DreamyProvider colorMode={colorMode}>{children}</DreamyProvider>\n" +
                "               </body>\n" +
                "           </html>\n" +
                "       );\n" +
                "   }\n"
        );
    } else {
        p.log.info(
            "1. Update your src/main.tsx or src/App.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider } from "${providerImportPath}";\n\n` +
                "   function App() {\n" +
                "       return (\n" +
                "           <DreamyProvider>\n" +
                "               {/* Your app content */}\n" +
                "           </DreamyProvider>\n" +
                "       );\n" +
                "   }\n"
        );
    }

    p.log.info(
        "2. Start your development server and begin using Dreamy UI components:\n\n" +
            '   import { Button } from "@/ui";\n\n' +
            "   export default function Page() {\n" +
            '       return <Button variant="primary">Hello Dreamy UI! 🌙</Button>;\n' +
            "   }\n"
    );

    p.log.info("3. Visit https://dreamy-ui.com/docs for more information\n");
}

export const InitCommand = new Command("init")
    .description("Initialize Dreamy UI in your project")
    .option("-y, --yes", "Skip all prompts and use defaults")
    .option("--skip-install", "Skip dependency installation")
    .option("--skip-components", "Skip adding default components")
    .action(async (flags: { yes?: boolean; skipInstall?: boolean; skipComponents?: boolean }) => {
        const cwd = process.cwd();

        p.intro("🌙 Dreamy UI Initialization");

        // Detect framework
        const framework = await detectFramework(cwd);

        if (!framework) {
            p.log.error(
                "✗ Could not detect a supported framework (React Router v7, Next.js, TanStack Start, or Vite)"
            );
            p.log.info(
                "💡 Make sure you have one of these config files:\n" +
                    "   - react-router.config.ts (React Router v7)\n" +
                    "   - next.config.js/ts/mjs (Next.js)\n" +
                    "   - .cta.json / @tanstack/react-start (TanStack Start)\n" +
                    "   - vite.config.js/ts (Vite)"
            );
            p.outro("Initialization cancelled");
            process.exit(1);
        }

        p.log.success(`✓ Detected framework: ${framework.type}`);

        // Check TypeScript
        const isTypeScript = existsSync(join(cwd, "tsconfig.json"));
        p.log.info(`Using ${isTypeScript ? "TypeScript" : "JavaScript"}`);

        // Install dependencies
        if (!flags.skipInstall) {
            await installDependencies(cwd, framework);
        } else {
            p.log.info("⊘ Skipped dependency installation");
        }

        // Create panda config
        await createPandaConfig(cwd, framework, isTypeScript);

        // Update package.json with prepare script
        await updatePackageJson(cwd);

        const useDefaults = flags.yes ?? false;
        const hasTailwind = detectTailwind(cwd, framework);

        if (hasTailwind) {
            const replaced = await replaceTailwindWithDreamy(cwd, framework, useDefaults);

            if (!replaced) {
                // User declined Tailwind replacement — still set up Panda alongside it
                await setupPostCSS(cwd, framework);
                await updateViteConfig(cwd, framework);
                await createCSSFile(cwd, framework);
                await ensureCSSImport(cwd, framework);
            }
        } else {
            // Setup PostCSS (Next.js only)
            await setupPostCSS(cwd, framework);

            // Update Vite config (Vite and React Router only)
            await updateViteConfig(cwd, framework);

            // Create CSS file
            await createCSSFile(cwd, framework);

            // Ensure CSS is imported
            await ensureCSSImport(cwd, framework);
        }

        // Update tsconfig
        if (isTypeScript) {
            await updateTsConfig(cwd);
        }

        // Create DreamyProvider
        const providerCreated = await createDreamyProvider(cwd, framework, isTypeScript);

        // Configure the app root with DreamyProvider
        if (providerCreated) {
            await configureAppRoot(cwd, framework, isTypeScript, useDefaults);
        } else {
            printNextSteps(cwd, framework);
        }

        // Add default components
        if (!flags.skipInstall && !flags.skipComponents) {
            await addDefaultComponents(cwd);
        } else if (flags.skipComponents) {
            p.log.info("⊘ Skipped adding default components");
        }

        // Run Panda codegen
        await runPandaCodegen(cwd);

        const shouldAddSkills = useDefaults
            ? true
            : await p.confirm({
                  message: "Add Dreamy UI agent skills to your project?",
                  initialValue: true
              });

        if (!p.isCancel(shouldAddSkills) && shouldAddSkills) {
            await installDreamySkills(cwd);
        } else if (p.isCancel(shouldAddSkills) || !shouldAddSkills) {
            p.log.info(
                "⊘ Skipped skills. You can add them later with: npx @dreamy-ui/cli add-skill"
            );
        }

        const shouldAddMcp = useDefaults
            ? true
            : await p.confirm({
                  message: "Add Dreamy UI MCP server to your AI clients?",
                  initialValue: true
              });

        if (!p.isCancel(shouldAddMcp) && shouldAddMcp) {
            await installDreamyMcp(cwd, { useDefaults });
        } else if (p.isCancel(shouldAddMcp) || !shouldAddMcp) {
            p.log.info(
                "⊘ Skipped MCP setup. You can add it later with: npx @dreamy-ui/cli add-mcp"
            );
        }

        p.log.info(
            "💡 If you see TypeScript errors after init, restart the TS server: press F1, then run \"TypeScript: Restart TS Server\"."
        );
        p.outro("✨ Dreamy UI initialized successfully!");
    });
