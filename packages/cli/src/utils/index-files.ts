import type { Debugger } from "debug";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path/posix";

function toCamelCase(str: string): string {
	return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export async function writeRecipesIndexFile(
	recipesDir: string,
	jsx: boolean,
	debug: Debugger
) {
	let recipeFiles: string[] = [];
	try {
		const allFiles = await readdir(recipesDir);
		recipeFiles = allFiles.filter(
			(file) =>
				(jsx && file.endsWith(".js")) || (!jsx && file.endsWith(".ts"))
		);
	} catch (error) {
		// Directory doesn't exist or is empty, skip
		return;
	}

	if (recipeFiles.length === 0) return;

	// Parse each file to extract export names
	const recipeExports: Array<{
		fileName: string;
		exportName: string;
	}> = [];

	for (const file of recipeFiles) {
		try {
			const filePath = join(recipesDir, file);
			const fileContent = await readFile(filePath, "utf-8");

			const fileName = file.replace(/\.(ts|js)$/, "");
			const expectedExportName = toCamelCase(fileName);

			// Extract export names using regex
			// Look for patterns like: export const someExport = ...
			// or export { someExport }
			const exportMatches = [
				...fileContent.matchAll(/export\s+const\s+(\w+)\s*=/g),
				...fileContent.matchAll(/export\s+\{\s*(\w+)\s*\}/g),
				...fileContent.matchAll(/export\s+\{\s*(\w+)\s+as\s+\w+\s*\}/g)
			];

			// Find the export that matches the camelCase filename
			const recipeExport = exportMatches
				.map((match) => match[1])
				.find((name) => name === expectedExportName);

			if (recipeExport) {
				recipeExports.push({
					fileName,
					exportName: recipeExport
				});
			} else {
				debug(
					`No recipe export found for ${expectedExportName} in ${file}`
				);
			}
		} catch (error) {
			// Skip files that can't be read
			debug(`Failed to read recipe file ${file}:`, error);
		}
	}

	if (recipeExports.length === 0) return;

	// Generate imports and exports using actual export names
	const imports = recipeExports
		.map(({ fileName, exportName }) => {
			return `import { ${exportName} } from "./${fileName}";`;
		})
		.join("\n");

	const exports = recipeExports
		.map(({ exportName }) => exportName)
		.join(",\n    ");

	const indexContent = `${imports}\n\nexport const recipes = {\n    ${exports}\n};\n`;

	const indexFilename = jsx ? "index.js" : "index.ts";
	const indexPath = join(recipesDir, indexFilename);

	await writeFile(indexPath, indexContent, "utf-8");
}

export async function writePatternsIndexFile(
	patternsDir: string,
	jsx: boolean,
	debug: Debugger
) {
	let patternFiles: string[] = [];
	try {
		const allFiles = await readdir(patternsDir);
		patternFiles = allFiles.filter(
			(file) =>
				(jsx && file.endsWith(".js")) || (!jsx && file.endsWith(".ts"))
		);
	} catch (error) {
		// Directory doesn't exist or is empty, skip
		return;
	}

	if (patternFiles.length === 0) return;

	// Parse each file to extract export names
	const patternExports: Array<{
		fileName: string;
		exportName: string;
	}> = [];

	for (const file of patternFiles) {
		try {
			const filePath = join(patternsDir, file);
			const fileContent = await readFile(filePath, "utf-8");

			const fileName = file.replace(/\.(ts|js)$/, "");
			const expectedExportName = toCamelCase(fileName);

			// Extract export names using regex
			// Look for patterns like: export const someExport = ...
			// or export { someExport }
			const exportMatches = [
				...fileContent.matchAll(/export\s+const\s+(\w+)\s*=/g),
				...fileContent.matchAll(/export\s+\{\s*(\w+)\s*\}/g),
				...fileContent.matchAll(/export\s+\{\s*(\w+)\s+as\s+\w+\s*\}/g)
			];

			// Find the export that matches the camelCase filename
			const patternExport = exportMatches
				.map((match) => match[1])
				.find((name) => name === expectedExportName);

			if (patternExport) {
				patternExports.push({
					fileName,
					exportName: patternExport
				});
			} else {
				debug(
					`No pattern export found for ${expectedExportName} in ${file}`
				);
			}
		} catch (error) {
			// Skip files that can't be read
			debug(`Failed to read pattern file ${file}:`, error);
		}
	}

	if (patternExports.length === 0) return;

	// Generate imports and exports using actual export names
	const imports = patternExports
		.map(({ fileName, exportName }) => {
			return `import { ${exportName} } from "./${fileName}";`;
		})
		.join("\n");

	const exports = patternExports
		.map(({ exportName }) => exportName)
		.join(",\n    ");

	const indexContent = `${imports}\n\nexport const patterns = {\n    ${exports}\n};\n`;

	const indexFilename = jsx ? "index.js" : "index.ts";
	const indexPath = join(patternsDir, indexFilename);

	await writeFile(indexPath, indexContent, "utf-8");
}
