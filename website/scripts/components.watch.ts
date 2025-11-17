import { execSync } from "node:child_process";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import chokidar from "chokidar";
import { main } from "./components";

setTimeout(() => {
    runAddComponents();
}, 250);

chokidar.watch("compositions").on("change", async () => {
    console.log("🔄 Generating components...");
    await main();
    await setTimeoutPromise(250);
    runAddComponents();
    console.log("✅ Components generated");
});

function runAddComponents() {
    execSync("pnpm dreamy add --all --force", { stdio: "inherit" });
}
