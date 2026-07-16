export interface ParsedRecipeVariants {
	[variantName: string]: string[];
}

export interface ParsedRecipe {
	id: string;
	description?: string;
	slots: string[];
	defaultVariants: Record<string, string>;
	variants: ParsedRecipeVariants;
	hasColorScheme: boolean;
	jsx: string[];
}

export interface ParsedPatternProperty {
	name: string;
	type: string;
	value?: string;
}

export interface ParsedPattern {
	id: string;
	properties: ParsedPatternProperty[];
	jsx: string[];
}

function extractStringArrayLiteral(source: string, propertyName: string): string[] {
	const regex = new RegExp(`${propertyName}\\s*:\\s*\\[`);
	const match = regex.exec(source);

	if (!match || match.index === undefined) {
		return [];
	}

	const start = match.index + match[0].length - 1;
	const literal = extractBalanced(source, start, "[", "]");

	if (!literal) {
		return [];
	}

	const matches = literal.match(/["'`]([^"'`]+)["'`]/g);

	if (!matches) {
		return [];
	}

	return matches.map(function (item) {
		return item.slice(1, -1);
	});
}

function extractBalanced(
	source: string,
	openIndex: number,
	openChar: string,
	closeChar: string
): string | null {
	if (source[openIndex] !== openChar) {
		return null;
	}

	let depth = 0;
	let inString: string | null = null;

	for (let i = openIndex; i < source.length; i++) {
		const char = source[i];
		const prev = source[i - 1];

		if (inString) {
			if (char === inString && prev !== "\\") {
				inString = null;
			}
			continue;
		}

		if (char === '"' || char === "'" || char === "`") {
			inString = char;
			continue;
		}

		if (char === openChar) {
			depth++;
		} else if (char === closeChar) {
			depth--;
			if (depth === 0) {
				return source.slice(openIndex + 1, i);
			}
		}
	}

	return null;
}

function findObjectProperty(source: string, propertyName: string): string | null {
	const regex = new RegExp(`${propertyName}\\s*:\\s*\\{`);
	const match = regex.exec(source);

	if (!match || match.index === undefined) {
		return null;
	}

	const openIndex = match.index + match[0].length - 1;
	return extractBalanced(source, openIndex, "{", "}");
}

/**
 * Top-level keys inside an object body (depth 0 only).
 */
function getTopLevelEntries(objectBody: string): Array<{ key: string; valueStart: number; valueEnd: number }> {
	const entries: Array<{ key: string; valueStart: number; valueEnd: number }> = [];
	let depth = 0;
	let inString: string | null = null;
	let i = 0;

	while (i < objectBody.length) {
		const char = objectBody[i];
		const prev = objectBody[i - 1];

		if (inString) {
			if (char === inString && prev !== "\\") {
				inString = null;
			}
			i++;
			continue;
		}

		if (char === '"' || char === "'" || char === "`") {
			inString = char;
			i++;
			continue;
		}

		if (char === "{" || char === "[" || char === "(") {
			depth++;
			i++;
			continue;
		}

		if (char === "}" || char === "]" || char === ")") {
			depth--;
			i++;
			continue;
		}

		if (depth === 0) {
			const keyMatch = objectBody.slice(i).match(/^([A-Za-z_$][\w$]*)\s*:/);

			if (keyMatch) {
				const key = keyMatch[1];
				const valueStart = i + keyMatch[0].length;
				let valueEnd = valueStart;
				let valueDepth = 0;
				let valueString: string | null = null;
				let j = valueStart;

				while (j < objectBody.length) {
					const valueChar = objectBody[j];
					const valuePrev = objectBody[j - 1];

					if (valueString) {
						if (valueChar === valueString && valuePrev !== "\\") {
							valueString = null;
						}
						j++;
						continue;
					}

					if (valueChar === '"' || valueChar === "'" || valueChar === "`") {
						valueString = valueChar;
						j++;
						continue;
					}

					if (valueChar === "{" || valueChar === "[" || valueChar === "(") {
						valueDepth++;
					} else if (valueChar === "}" || valueChar === "]" || valueChar === ")") {
						valueDepth--;
					} else if (valueChar === "," && valueDepth === 0) {
						valueEnd = j;
						break;
					}

					j++;
					valueEnd = j;
				}

				entries.push({ key, valueStart, valueEnd });
				i = valueEnd + 1;
				continue;
			}
		}

		i++;
	}

	return entries;
}

function parseDefaultVariants(source: string): Record<string, string> {
	const block = findObjectProperty(source, "defaultVariants");

	if (!block) {
		return {};
	}

	const defaults: Record<string, string> = {};
	const entryRegex = /([A-Za-z_$][\w$]*)\s*:\s*["'`]([^"'`]+)["'`]/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(block)) !== null) {
		defaults[match[1]] = match[2];
	}

	return defaults;
}

function parseVariants(source: string): ParsedRecipeVariants {
	const block = findObjectProperty(source, "variants");

	if (!block) {
		return {};
	}

	const variants: ParsedRecipeVariants = {};
	const entries = getTopLevelEntries(block);

	for (const entry of entries) {
		const value = block.slice(entry.valueStart, entry.valueEnd).trim();

		if (/^getColorSchemes\s*\(/.test(value)) {
			variants[entry.key] = ["primary", "secondary", "success", "warning", "error", "info"];
			continue;
		}

		if (value.startsWith("{")) {
			const body = extractBalanced(value, 0, "{", "}");

			if (!body) {
				continue;
			}

			const values = getTopLevelEntries(body).map(function (item) {
				return item.key;
			});

			if (values.length > 0) {
				variants[entry.key] = values;
			}
		}
	}

	return variants;
}

function parseDefinePartsSlots(source: string): string[] {
	const match = source.match(/defineParts\s*\(\s*\{/);

	if (!match || match.index === undefined) {
		return [];
	}

	const openIndex = match.index + match[0].length - 1;
	const body = extractBalanced(source, openIndex, "{", "}");

	if (!body) {
		return [];
	}

	return getTopLevelEntries(body).map(function (entry) {
		return entry.key;
	});
}

function parseDescription(source: string): string | undefined {
	const match = source.match(/description\s*:\s*["'`]([\s\S]*?)["'`]/);

	if (!match) {
		return undefined;
	}

	return match[1].replace(/\s+/g, " ").trim();
}

export function parseRecipe(id: string, source: string): ParsedRecipe {
	const variants = parseVariants(source);
	const slotsFromParts = parseDefinePartsSlots(source);
	const slotsFromRecipe = extractStringArrayLiteral(source, "slots");

	return {
		id,
		description: parseDescription(source),
		slots: slotsFromParts.length > 0 ? slotsFromParts : slotsFromRecipe,
		defaultVariants: parseDefaultVariants(source),
		variants,
		hasColorScheme: Boolean(variants.scheme) || /getColorSchemes\s*\(/.test(source),
		jsx: extractStringArrayLiteral(source, "jsx")
	};
}

export function parsePattern(id: string, source: string): ParsedPattern {
	const propertiesBlock = findObjectProperty(source, "properties");
	const properties: ParsedPatternProperty[] = [];

	if (propertiesBlock) {
		const propRegex =
			/([A-Za-z_$][\w$]*)\s*:\s*\{\s*type\s*:\s*["'`]([^"'`]+)["'`](?:\s*,\s*value\s*:\s*["'`]([^"'`]+)["'`])?/g;
		let match: RegExpExecArray | null;

		while ((match = propRegex.exec(propertiesBlock)) !== null) {
			properties.push({
				name: match[1],
				type: match[2],
				value: match[3]
			});
		}
	}

	return {
		id,
		properties,
		jsx: extractStringArrayLiteral(source, "jsx")
	};
}
