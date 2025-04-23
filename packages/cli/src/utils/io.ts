import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function ensureDir(dirPath: string): void {
	if (existsSync(dirPath)) return;
	ensureDir(dirname(dirPath));
	mkdirSync(dirPath);
}
