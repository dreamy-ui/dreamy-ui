export interface ParsedProp {
	name: string;
	type: string;
	required: boolean;
	description?: string;
	defaultValue?: string;
}

export interface ParsedInterface {
	name: string;
	description?: string;
	extendsTypes: string[];
	props: ParsedProp[];
}

export interface ParsedExport {
	name: string;
	kind: "function" | "const" | "component";
	description?: string;
}

interface JsDocInfo {
	description?: string;
	defaultValue?: string;
	isInternal: boolean;
}

function parseJsDocText(raw: string): JsDocInfo {
	const lines = raw
		.replace(/^\/\*\*/, "")
		.replace(/\*\/$/, "")
		.split("\n")
		.map(function (line) {
			return line.replace(/^\s*\*\s?/, "").trim();
		});

	const descriptionParts: string[] = [];
	let defaultValue: string | undefined;
	let isInternal = false;

	for (const line of lines) {
		if (!line) {
			continue;
		}

		if (line.startsWith("@internal")) {
			isInternal = true;
			continue;
		}

		if (line.startsWith("@default")) {
			defaultValue = line.replace(/^@default\s+/, "").trim();
			continue;
		}

		if (line.startsWith("@")) {
			continue;
		}

		descriptionParts.push(line);
	}

	return {
		description: descriptionParts.length ? descriptionParts.join(" ") : undefined,
		defaultValue,
		isInternal
	};
}

function extractJsDocBefore(source: string, index: number): JsDocInfo | undefined {
	const before = source.slice(Math.max(0, index - 1200), index);
	const matches = Array.from(before.matchAll(/\/\*\*([\s\S]*?)\*\//g));
	const last = matches[matches.length - 1];

	if (!last || last.index === undefined) {
		return undefined;
	}

	const afterJsDoc = before.slice(last.index + last[0].length);

	if (!/^\s*$/.test(afterJsDoc)) {
		return undefined;
	}

	return parseJsDocText(last[0]);
}

function extractInterfaceBody(source: string, startIndex: number): string | null {
	const braceStart = source.indexOf("{", startIndex);

	if (braceStart === -1) {
		return null;
	}

	let depth = 0;
	let inString: string | null = null;

	for (let i = braceStart; i < source.length; i++) {
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

		if (char === "{") {
			depth++;
		} else if (char === "}") {
			depth--;
			if (depth === 0) {
				return source.slice(braceStart + 1, i);
			}
		}
	}

	return null;
}

function parsePropLine(line: string): Omit<ParsedProp, "description" | "defaultValue"> | null {
	const trimmed = line.trim();

	if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
		return null;
	}

	const match = trimmed.match(/^([A-Za-z_$][\w$]*)(\?)?:\s*(.+?);?\s*$/);

	if (!match) {
		return null;
	}

	return {
		name: match[1],
		required: !match[2],
		type: match[3].replace(/;$/, "").trim()
	};
}

function parseInterfaceProps(body: string): ParsedProp[] {
	const props: ParsedProp[] = [];
	const lines = body.split(/\r?\n/);
	let jsDocBuffer: string[] = [];
	let collectingJsDoc = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.includes("/**")) {
			collectingJsDoc = true;
			jsDocBuffer = [trimmed];

			if (trimmed.includes("*/")) {
				collectingJsDoc = false;
			}
			continue;
		}

		if (collectingJsDoc) {
			jsDocBuffer.push(trimmed);

			if (trimmed.includes("*/")) {
				collectingJsDoc = false;
			}
			continue;
		}

		const prop = parsePropLine(line);

		if (!prop) {
			continue;
		}

		const jsDoc = jsDocBuffer.length ? parseJsDocText(jsDocBuffer.join("\n")) : undefined;
		jsDocBuffer = [];

		props.push({
			...prop,
			description: jsDoc?.description,
			defaultValue: jsDoc?.defaultValue
		});
	}

	return props;
}

function isPublicInterface(name: string, jsDoc?: JsDocInfo): boolean {
	if (name.startsWith("Internal")) {
		return false;
	}

	if (jsDoc?.isInternal) {
		return false;
	}

	return true;
}

/**
 * Extract interfaces (exported and local) and their props from component source.
 */
export function parseComponentProps(source: string, options?: { exportedOnly?: boolean }): ParsedInterface[] {
	const exportedOnly = options?.exportedOnly ?? false;
	const interfaces: ParsedInterface[] = [];
	const interfaceRegex =
		/(export\s+)?interface\s+([A-Za-z_$][\w$]*)(?:<[^>]*>)?(?:\s+extends\s+([^{]+))?/g;

	let match: RegExpExecArray | null;

	while ((match = interfaceRegex.exec(source)) !== null) {
		const isExported = Boolean(match[1]);
		const name = match[2];
		const jsDoc = extractJsDocBefore(source, match.index);

		if (exportedOnly && !isExported) {
			continue;
		}

		if (!isPublicInterface(name, jsDoc)) {
			continue;
		}

		const body = extractInterfaceBody(source, match.index);

		if (!body) {
			continue;
		}

		const extendsTypes = (match[3] ?? "")
			.split(",")
			.map(function (part) {
				return part.trim();
			})
			.filter(Boolean);

		interfaces.push({
			name,
			description: jsDoc?.description,
			extendsTypes,
			props: parseInterfaceProps(body)
		});
	}

	return interfaces;
}

/**
 * Extract exported component parts (Button, Root, Trigger, etc.).
 */
export function parseComponentExports(source: string): ParsedExport[] {
	const exports: ParsedExport[] = [];
	const seen = new Set<string>();

	const patterns: Array<{ regex: RegExp; kind: ParsedExport["kind"] }> = [
		{
			regex: /export\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*)/g,
			kind: "component"
		},
		{
			regex: /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*[:=]/g,
			kind: "const"
		}
	];

	for (const { regex, kind } of patterns) {
		let match: RegExpExecArray | null;

		while ((match = regex.exec(source)) !== null) {
			const name = match[1];

			if (seen.has(name)) {
				continue;
			}

			const jsDoc = extractJsDocBefore(source, match.index);

			if (jsDoc?.isInternal) {
				continue;
			}

			seen.add(name);
			exports.push({
				name,
				kind,
				description: jsDoc?.description
			});
		}
	}

	return exports;
}

/**
 * Prefer the main *Props interface, interfaces it extends, and related slot props.
 */
export function selectPrimaryInterfaces(
	interfaces: ParsedInterface[],
	componentName: string
): ParsedInterface[] {
	const byName = new Map(
		interfaces.map(function (item) {
			return [item.name, item] as const;
		})
	);
	const primaryName = `${componentName}Props`;
	const primary = byName.get(primaryName);

	const selected: ParsedInterface[] = [];
	const seen = new Set<string>();

	function add(item: ParsedInterface | undefined) {
		if (!item || seen.has(item.name)) {
			return;
		}

		seen.add(item.name);
		selected.push(item);

		for (const ext of item.extendsTypes) {
			for (const [name, iface] of byName) {
				const pattern = new RegExp(`(?:^|[^A-Za-z0-9_])${name}(?:$|[^A-Za-z0-9_])`);

				if (pattern.test(ext)) {
					add(iface);
				}
			}
		}
	}

	add(primary);

	for (const iface of interfaces) {
		if (
			iface.name !== primaryName &&
			iface.name.startsWith(componentName) &&
			iface.name.endsWith("Props") &&
			iface.props.length > 0
		) {
			add(iface);
		}
	}

	if (selected.length > 0) {
		return selected;
	}

	return interfaces.filter(function (item) {
		return item.name.endsWith("Props") && item.props.length > 0;
	});
}
