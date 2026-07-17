import { spawn } from "node:child_process";
import { resolve } from "node:path";
import * as p from "@clack/prompts";
import { Command } from "commander";

interface AddSkillCommandFlags {
    cwd?: string;
}

const SKILLS = ["dreamy-ui", "dreamy-ui-frontend", "dreamy-ui-theming"] as const;

export async function installDreamySkills(cwd: string): Promise<boolean> {
    const skillArgs = SKILLS.flatMap(function mapSkillArg(skill) {
        return ["--skill", skill];
    });

    const exitCode = await new Promise<number>(function runSkillsAdd(resolveExit) {
        const child = spawn(
            "npx",
            ["-y", "skills", "add", "dreamy-ui/dreamy-ui", ...skillArgs],
            {
                cwd,
                stdio: "inherit",
                shell: true
            }
        );

        child.on("error", function onSpawnError(error) {
            p.log.error(error.message);
            resolveExit(1);
        });

        child.on("close", function onClose(code) {
            resolveExit(code ?? 1);
        });
    });

    if (exitCode !== 0) {
        p.log.error("Failed to add Dreamy UI skills.");
        return false;
    }

    p.log.success(
        "✓ Skill setup complete! Installed: dreamy-ui, dreamy-ui-frontend, dreamy-ui-theming."
    );
    return true;
}

export const AddSkillCommand = new Command("add-skill")
    .description("Add the Dreamy UI agent skills to your project")
    .option("--cwd <cwd>", "Current working directory", process.cwd())
    .action(async function addSkillAction(flags: AddSkillCommandFlags) {
        const cwd = resolve(flags.cwd ?? process.cwd());

        p.intro("Dreamy UI Skill Setup");

        const success = await installDreamySkills(cwd);

        if (!success) {
            p.cancel("Failed to add Dreamy UI skills.");
            process.exit(1);
        }

        p.outro(
            "Skill setup complete! Installed: dreamy-ui, dreamy-ui-frontend, dreamy-ui-theming."
        );
    });
