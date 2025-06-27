import chokidar from "chokidar";
import { execSync } from "node:child_process";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
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
	execSync("pnpm dreamy components add --all --force", { stdio: "inherit" });
}
