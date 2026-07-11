export function uniq<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

export interface FetchResult<T> {
	ok: true;
	data: T;
}

export interface FetchError {
	ok: false;
	error: string;
}

export type SafeFetchResult<T> = FetchResult<T> | FetchError;

export type ComponentList = ComponentIndexItem[];

export interface ExtendedComponentIndexItem extends ComponentIndexItem {
	installCommand: string;
}

export interface ComponentIndexItem {
	type: string;
	id: string;
	file: string;
	component: string;
	npmDependencies?: string[];
	fileDependencies: string[];
	hasRecipe: boolean;
	hasPattern: boolean;
	recipeIds?: string[];
	patternIds?: string[];
}

export interface RegistryFile {
	name: string;
	content: string;
}

export interface ComponentItem {
	type: string;
	fileDependencies: string[];
	npmDependencies?: string[];
	id: string;
	file: RegistryFile;
	component: string;
	hasRecipe: boolean;
	hasPattern: boolean;
	recipeIds?: string[];
	patternIds?: string[];
}

export interface RecipeItem {
	type: string;
	id: string;
	file: RegistryFile;
}

export interface PatternItem {
	type: string;
	id: string;
	file: RegistryFile;
}

const DREAMY_BASE_URL = process.env.DREAMY_UI_BASE_URL || "http://localhost:3000";

function createDreamyUrl(path: string): string {
	return `${DREAMY_BASE_URL}${path}`;
}

function toErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : "Unknown error";
}

async function fetchJsonSafe<T>(url: string, errorContext?: string): Promise<SafeFetchResult<T>> {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			const context = errorContext || `fetch ${url}`;
			return {
				ok: false,
				error: `Failed to ${context}: ${response.status} ${response.statusText}`
			};
		}

		const json = await response.json();
		return { ok: true, data: json as T };
	} catch (error) {
		const context = errorContext || `fetch ${url}`;
		return {
			ok: false,
			error: `Failed to ${context}: ${toErrorMessage(error)}`
		};
	}
}

async function fetchTextSafe(
	url: string,
	errorContext?: string
): Promise<SafeFetchResult<string>> {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			const context = errorContext || `fetch ${url}`;
			return {
				ok: false,
				error: `Failed to ${context}: ${response.status} ${response.statusText}`
			};
		}

		return { ok: true, data: await response.text() };
	} catch (error) {
		const context = errorContext || `fetch ${url}`;
		return {
			ok: false,
			error: `Failed to ${context}: ${toErrorMessage(error)}`
		};
	}
}

export async function fetchComponentListSafe(): Promise<SafeFetchResult<ComponentList>> {
	return fetchJsonSafe<ComponentList>(
		createDreamyUrl("/components/index.json"),
		"fetch component list"
	);
}

export async function fetchComponentSafe(component: string): Promise<SafeFetchResult<ComponentItem>> {
	return fetchJsonSafe<ComponentItem>(
		createDreamyUrl(`/components/${component}.json`),
		`fetch component data for ${component}`
	);
}

export async function fetchRecipeSafe(recipeId: string): Promise<SafeFetchResult<RecipeItem>> {
	return fetchJsonSafe<RecipeItem>(
		createDreamyUrl(`/recipes/${recipeId}.json`),
		`fetch recipe "${recipeId}"`
	);
}

export async function fetchPatternSafe(patternId: string): Promise<SafeFetchResult<PatternItem>> {
	return fetchJsonSafe<PatternItem>(
		createDreamyUrl(`/patterns/${patternId}.json`),
		`fetch pattern "${patternId}"`
	);
}

export async function getComponentExampleSafe(
	component: string
): Promise<SafeFetchResult<string>> {
	return fetchTextSafe(
		createDreamyUrl(`/docs/components/${component}.mdx`),
		`fetch documentation for component ${component}`
	);
}

function pascalToKebab(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

export function resolveComponentId(
	input: string,
	componentList: ComponentIndexItem[]
): string | null {
	const normalized = input.trim().toLowerCase();

	for (const component of componentList) {
		if (component.id === normalized) {
			return component.id;
		}

		if (component.component.toLowerCase() === normalized) {
			return component.id;
		}

		if (pascalToKebab(component.component) === normalized) {
			return component.id;
		}
	}

	return null;
}

export async function getAllComponentNames(): Promise<string[]> {
	const result = await fetchComponentListSafe();

	if (!result.ok) {
		console.error(`Dreamy UI MCP: ${result.error}`);
		return [];
	}

	return result.data.map((component) => component.id);
}

export async function getAllComponents(): Promise<ExtendedComponentIndexItem[]> {
	const result = await fetchComponentListSafe();

	if (!result.ok) {
		console.error(`Dreamy UI MCP: ${result.error}`);
		return [];
	}

	return result.data.map((component) => ({
		...component,
		installCommand: `dreamy add ${component.id}`
	}));
}

export async function getComponentIndex(): Promise<ComponentIndexItem[]> {
	const result = await fetchComponentListSafe();

	if (!result.ok) {
		console.error(`Dreamy UI MCP: ${result.error}`);
		return [];
	}

	return result.data;
}
