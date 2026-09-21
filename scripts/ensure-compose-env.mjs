/**
 * Ensures root `.env` contains strong secrets for docker compose (local / non-Coolify).
 * Coolify generates the same variable names automatically when deploying compose.
 *
 * Usage: node scripts/ensure-compose-env.mjs
 */
import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(ROOT, ".env");

/** @type {readonly { key: string; bytes: number }[]} */
const SECRETS = [{ key: "SERVICE_PASSWORD_64_REDIS", bytes: 32 }];

function envHasKey(content, key) {
    const pattern = new RegExp(`^${key}=`, "m");
    return pattern.test(content);
}

function generateSecret(bytes) {
    return randomBytes(bytes).toString("hex");
}

function main() {
    const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
    const additions = [];

    for (const { key, bytes } of SECRETS) {
        if (envHasKey(existing, key) || envHasKey(additions.join("\n"), key)) {
            continue;
        }

        additions.push(`${key}=${generateSecret(bytes)}`);
    }

    if (additions.length === 0) {
        console.log("Compose secrets already present in .env");
        return;
    }

    const prefix = existing.length > 0 && !existing.endsWith("\n") ? "\n" : existing.length > 0 ? "" : "";
    const block = `${prefix}\n# Generated for docker compose (${new Date().toISOString()})\n${additions.join("\n")}\n`;

    appendFileSync(ENV_PATH, block, "utf8");

    for (const line of additions) {
        console.log(`Added ${line.split("=")[0]} to .env`);
    }
}

main();
