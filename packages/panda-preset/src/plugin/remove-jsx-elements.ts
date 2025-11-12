import fs from "node:fs/promises";
import path from "node:path";

export async function removeJsxElements(jsxFolder: string) {
	const files = await fs.readdir(jsxFolder);
	for (const file of files) {
		if (
			!["index", "factory", "is-valid-prop", "create-style-context"].some((prefix) =>
				file.startsWith(prefix)
			)
		) {
			await fs.unlink(path.join(jsxFolder, file));
		}
	}

	let js: "mjs" | "js" | "both" = "js";

	// read the index.js and index.mjs files
	const indexJs = await fs.readFile(path.join(jsxFolder, "index.js"), "utf-8").catch(() => null);
	const indexMjs = await fs
		.readFile(path.join(jsxFolder, "index.mjs"), "utf-8")
		.catch(() => null);

	if (indexJs && indexMjs) {
		js = "both";
	} else if (indexJs) {
		js = "js";
	} else if (indexMjs) {
		js = "mjs";
	}

	const indexContent = `export * from './factory.js';
export * from './is-valid-prop.js';
export * from './create-style-context.js';
`;

	// write the index files
	await Promise.all([
		(js === "js" || js === "both") &&
			fs.writeFile(path.join(jsxFolder, "index.js"), indexContent),
		(js === "mjs" || js === "both") &&
			fs.writeFile(path.join(jsxFolder, "index.mjs"), indexContent),
		fs.writeFile(
			path.join(jsxFolder, "index.d.ts"),
			`export * from './factory';
export * from './is-valid-prop';
export * from './create-style-context';
export type { HTMLDreamyProps, DreamyComponent } from '../types/jsx';`
		)
	]);
}
