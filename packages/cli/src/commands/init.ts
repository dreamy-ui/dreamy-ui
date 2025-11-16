import { exec } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import * as p from "@clack/prompts";
import { Command } from "commander";
import { globbySync } from "globby";
import { detect } from "package-manager-detector";
import { installCommand, pandaCodegenCommand } from "../utils/codegen-command";
import { ensureDir } from "../utils/io";

const execAsync = promisify(exec);

interface FrameworkConfig {
    type: "react-router" | "nextjs" | "vite" | null;
    cssPath: string;
    cssImportPath: string;
    providerPath: string;
    includePattern: string;
}

async function detectFramework(cwd: string): Promise<FrameworkConfig | null> {
    const files = globbySync(["react-router.config.*", "next.config.*", "vite.config.*"], { cwd });

    // Detect React Router v7
    if (files.find((file) => file.startsWith("react-router.config"))) {
        return {
            type: "react-router",
            cssPath: "app/index.css",
            cssImportPath: "app/root.tsx",
            providerPath: "app/components/dreamy-provider.tsx",
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
            providerPath: hasSrcDir
                ? "src/components/dreamy-provider.tsx"
                : "components/dreamy-provider.tsx",
            includePattern: hasSrcDir ? "./src/**/*.{js,jsx,ts,tsx}" : "./app/**/*.{js,jsx,ts,tsx}"
        };
    }

    // Detect Vite
    if (files.find((file) => file.startsWith("vite.config"))) {
        const hasSrcDir = existsSync(join(cwd, "src"));
        return {
            type: "vite",
            cssPath: hasSrcDir ? "src/index.css" : "src/index.css",
            cssImportPath: hasSrcDir ? "src/main.tsx" : "src/main.tsx",
            providerPath: hasSrcDir
                ? "src/components/dreamy-provider.tsx"
                : "src/components/dreamy-provider.tsx",
            includePattern: "./src/**/*.{js,jsx,ts,tsx}"
        };
    }

    return null;
}

async function installDependencies(cwd: string, _framework: FrameworkConfig) {
    try {
        p.log.info("Installing Dreamy UI dependencies...");

        // Install Panda CSS
        await installCommand(["@pandacss/dev", "@pandacss/postcss", "-D"], cwd);
        p.log.success("✓ Panda CSS dev dependencies installed");

        // Install Dreamy UI packages
        await installCommand(
            ["@dreamy-ui/react", "@dreamy-ui/panda-preset", "@dreamy-ui/cli", "motion"],
            cwd
        );
        p.log.success("✓ Dreamy UI packages installed");

        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`
        );
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

        const configContent = isTypeScript
            ? `import createDreamyPreset, { dreamyPlugin } from "@dreamy-ui/panda-preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    preflight: true,
    watch: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "${framework.includePattern}"
    ],
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin()],
    theme: {
        extend: {}
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

export default defineConfig({
    preflight: true,
    watch: true,
    jsxFramework: "react",
    jsxStyleProps: "all",
    outExtension: "js",
    jsxFactory: "dreamy",
    include: [
        "${framework.includePattern}"
    ],
    presets: [createDreamyPreset()],
    plugins: [dreamyPlugin()],
    theme: {
        extend: {}
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

async function setupPostCSS(cwd: string, framework: FrameworkConfig) {
    try {
        // Next.js needs PostCSS config
        if (framework.type === "nextjs") {
            const postcssPath = join(cwd, "postcss.config.mjs");

            if (existsSync(postcssPath)) {
                const content = readFileSync(postcssPath, "utf-8");
                if (content.includes("@pandacss/postcss")) {
                    p.log.info("⊘ PostCSS already configured for Panda CSS");
                    return true;
                }

                const shouldUpdate = await p.confirm({
                    message: "postcss.config.mjs exists but doesn't include Panda CSS. Update it?",
                    initialValue: true
                });

                if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                    p.log.warn("⊘ Skipped PostCSS configuration");
                    return false;
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

async function createCSSFile(cwd: string, framework: FrameworkConfig) {
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

            const shouldUpdate = await p.confirm({
                message: `${framework.cssPath} exists. Add Panda CSS layers to it?`,
                initialValue: true
            });

            if (p.isCancel(shouldUpdate) || !shouldUpdate) {
                p.log.warn("⊘ Skipped CSS file update");
                return false;
            }

            // Prepend Panda CSS layers
            const updatedContent = `@layer reset, base, tokens, recipes, utilities;

${content}`;
            await writeFile(cssPath, updatedContent, "utf-8");
            p.log.success(`✓ Updated ${framework.cssPath} with Panda CSS layers`);
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

async function ensureCSSImport(cwd: string, framework: FrameworkConfig) {
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

async function removeTailwindFromReactRouter(cwd: string) {
    try {
        const appCssPath = join(cwd, "app/app.css");
        const rootTsxPath = join(cwd, "app/root.tsx");

        // Remove app.css if it exists
        if (existsSync(appCssPath)) {
            await unlink(appCssPath);
            p.log.success("✓ Removed Tailwind CSS file (app/app.css)");
        }

        // Remove import from root.tsx
        if (existsSync(rootTsxPath)) {
            const content = readFileSync(rootTsxPath, "utf-8");
            if (content.includes("./app.css")) {
                const updatedContent = content
                    .split("\n")
                    .filter((line) => !line.includes("./app.css"))
                    .join("\n");
                await writeFile(rootTsxPath, updatedContent, "utf-8");
                p.log.success("✓ Removed Tailwind CSS import from root.tsx");
            }
        }

        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to remove Tailwind CSS: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn("💡 You may need to manually remove app/app.css and its import from root.tsx");
        return false;
    }
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

        if (framework.type === "react-router") {
            providerContent = isTypeScript
                ? `"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";
import { getColorModeHTMLProps, getSSRColorMode } from "@dreamy-ui/react/rsc";
import type { Route } from "./+types/root";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
    colorMode?: Route.ComponentProps["loaderData"]["colorMode"];
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

const domMax = () => import("motion/react").then((mod) => mod.domMax);

interface DreamyProviderProps {
    children: React.ReactNode;
}

export function DreamyProvider({ children }: DreamyProviderProps) {
    return (
        <BaseDreamyProvider motionFeatures={domMax} motionStrict>
            {children}
        </BaseDreamyProvider>
    );
}
`
                : `"use client";

import { DreamyProvider as BaseDreamyProvider } from "@dreamy-ui/react";

const domMax = () => import("motion/react").then((mod) => mod.domMax);

export function DreamyProvider({ children }) {
    return (
        <BaseDreamyProvider motionFeatures={domMax} motionStrict>
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

async function updateTsConfig(cwd: string) {
    try {
        const tsconfigPath = join(cwd, "tsconfig.json");

        if (!existsSync(tsconfigPath)) {
            p.log.info("⊘ No tsconfig.json found, skipping TypeScript configuration");
            return true;
        }

        const content = readFileSync(tsconfigPath, "utf-8");

        if (content.includes("styled-system")) {
            p.log.info("⊘ tsconfig.json already includes styled-system");
            return true;
        }

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

        // Parse and update tsconfig
        const tsconfig = JSON.parse(content);
        if (!tsconfig.include) {
            tsconfig.include = [];
        }
        tsconfig.include.push("styled-system/**/*");

        await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf-8");
        p.log.success("✓ Updated tsconfig.json");
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to update tsconfig.json: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn('💡 Manually add "styled-system/**/*" to the "include" array in tsconfig.json');
        return false;
    }
}

async function runPandaCodegen(cwd: string) {
    try {
        p.log.info("Running Panda CSS codegen...");
        await pandaCodegenCommand(cwd);
        p.log.success("✓ Panda CSS codegen completed");
        return true;
    } catch (error) {
        p.log.error(
            `✗ Failed to run Panda codegen: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.warn("💡 You can manually run Panda codegen:\n" + "   npx panda codegen");
        return false;
    }
}

async function addDefaultComponents(cwd: string) {
    try {
        const defaultComponents = ["button", "input", "card"];
        p.log.info(`Adding default components (${defaultComponents.join(", ")})...`);

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
        const command = `${runner} dreamy add ${defaultComponents.join(" ")}`;

        await execAsync(command, { cwd, encoding: "utf-8" });
        p.log.success("✓ Default components added");
        return true;
    } catch (error) {
        p.log.warn(
            `⚠ Failed to add default components: ${error instanceof Error ? error.message : String(error)}`
        );
        p.log.info(
            "💡 You can manually add components later:\n   npx dreamy add button input card"
        );
        return false;
    }
}

function printNextSteps(framework: FrameworkConfig) {
    p.log.info("\n📋 Next Steps:");
    p.log.info("━".repeat(50));

    if (framework.type === "react-router") {
        p.log.info(
            "\n1. Update your app/root.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider, getColorModeHTMLProps, getSSRColorMode } from "./${framework.providerPath.replace("app/", "")}";\n` +
                '   import type { Route } from "./+types/root";\n\n' +
                "   export function loader({ request }: Route.LoaderArgs) {\n" +
                "       return { colorMode: getSSRColorMode(request) };\n" +
                "   }\n\n" +
                "   export function Layout({ children }: { children: React.ReactNode }) {\n" +
                '       const { colorMode } = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root") ?? {};\n' +
                "       return (\n" +
                '           <html lang="en" {...getColorModeHTMLProps(colorMode)}>\n' +
                "               <body>\n" +
                "                   <DreamyProvider colorMode={colorMode}>\n" +
                "                       {children}\n" +
                "                   </DreamyProvider>\n" +
                "               </body>\n" +
                "           </html>\n" +
                "       );\n" +
                "   }\n"
        );
    } else if (framework.type === "nextjs") {
        p.log.info(
            "\n1. Update your app/layout.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider } from "@/${framework.providerPath.replace(/^(src\/)?/, "")}";\n\n` +
                "   export default function RootLayout({ children }) {\n" +
                "       return (\n" +
                '           <html lang="en">\n' +
                "               <body>\n" +
                "                   <DreamyProvider>\n" +
                "                       {children}\n" +
                "                   </DreamyProvider>\n" +
                "               </body>\n" +
                "           </html>\n" +
                "       );\n" +
                "   }\n"
        );
    } else {
        p.log.info(
            "\n1. Update your src/main.tsx or src/App.tsx to use DreamyProvider:\n\n" +
                `   import { DreamyProvider } from "./${framework.providerPath.replace("src/", "")}";\n\n` +
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
        "\n2. Run Panda CSS codegen:\n   npx panda codegen\n" +
            '\n3. Start using Dreamy UI components:\n   import { Button } from "@dreamy-ui/react";\n' +
            "\n4. Visit https://dreamy-ui.com/docs for more information\n"
    );
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
                "✗ Could not detect a supported framework (React Router v7, Next.js, or Vite)"
            );
            p.log.info(
                "💡 Make sure you have one of these config files:\n" +
                    "   - react-router.config.ts (React Router v7)\n" +
                    "   - next.config.js/ts/mjs (Next.js)\n" +
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

        // Setup PostCSS (Next.js only)
        await setupPostCSS(cwd, framework);

        // Remove Tailwind CSS (React Router only)
        if (framework.type === "react-router") {
            await removeTailwindFromReactRouter(cwd);
        }

        // Create CSS file
        await createCSSFile(cwd, framework);

        // Ensure CSS is imported
        await ensureCSSImport(cwd, framework);

        // Update tsconfig
        if (isTypeScript) {
            await updateTsConfig(cwd);
        }

        // Create DreamyProvider
        await createDreamyProvider(cwd, framework, isTypeScript);

        // Run Panda codegen
        await runPandaCodegen(cwd);

        // Add default components
        if (!flags.skipInstall && !flags.skipComponents) {
            await addDefaultComponents(cwd);
        } else if (flags.skipComponents) {
            p.log.info("⊘ Skipped adding default components");
        }

        // Print next steps
        printNextSteps(framework);

        p.outro("✨ Dreamy UI initialized successfully!");
    });
