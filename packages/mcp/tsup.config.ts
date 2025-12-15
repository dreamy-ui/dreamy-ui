import { defineConfig } from "tsup";

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

try {
	process.loadEnvFile(envFile);
} catch (_error) {
	try {
		process.loadEnvFile(".env");
	} catch (_error) {}
}

export default defineConfig({
	entry: { stdio: "src/stdio.ts" },
	format: "esm",
	outDir: "dist",
	treeshake: "safest",
	splitting: false,
	env: {
		DREAMY_UI_BASE_URL: process.env.DREAMY_UI_BASE_URL ?? "http://localhost:3000"
	}
});
