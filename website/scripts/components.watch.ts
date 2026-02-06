import { execSync } from "node:child_process";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import chokidar from "chokidar";
import { main } from "./components";

// wait till localhost:3000 is running
while (true) {
    try {
        execSync("curl -s http://localhost:3000");
        break;
    } catch (error) {
        console.log("Waiting for localhost:3000 to be running...");
        await setTimeoutPromise(1000);
    }
}

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
