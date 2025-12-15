export function uniq<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

export type ComponentList = ComponentIndexItem[];

export interface ExtendedComponentIndexItem extends ComponentIndexItem {
	installCommand: string;
}

export interface ComponentIndexItem {
	type: string;
	id: string;
	file: string;
	component: string;
	fileDependencies: string[];
	hasRecipe: boolean;
	hasPattern: boolean;
	recipeIds?: string[];
	patternIds?: string[];
}

export interface ComponentItem {
	type: string;
	fileDependencies: string[];
	id: string;
	file: File;
	component: string;
	hasRecipe: boolean;
	hasPattern: boolean;
	recipeIds: string[];
}

export interface File {
	name: string;
	content: string;
}

// Base URLs for different API endpoints
// Fallback to localhost for development if not set
const DREAMY_BASE_URL = process.env.DREAMY_UI_BASE_URL || "http://localhost:3000";

/**
 * Generic fetch utility with consistent error handling
 */
async function fetchJson<T>(url: string, options?: RequestInit, errorContext?: string): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		const context = errorContext || `fetch ${url}`;
		throw new Error(`Failed to ${context}: ${response.status} ${response.statusText}`);
	}
	const json = await response.json();

	return json as T;
}

async function fetchText(
	url: string,
	options?: RequestInit,
	errorContext?: string
): Promise<string> {
	const response = await fetch(url, options);
	if (!response.ok) {
		const context = errorContext || `fetch ${url}`;
		throw new Error(`Failed to ${context}: ${response.status} ${response.statusText}`);
	}
	return await response.text();
}

/**
 * Creates a Dreamy UI API URL
 */
function createDreamyUrl(path: string): string {
	return `${DREAMY_BASE_URL}${path}`;
}

/**
 * Fetches the list of all available Dreamy UI components
 */
export async function fetchComponentList(): Promise<ComponentList> {
	return fetchJson<ComponentList>(
		createDreamyUrl("/components/index.json"),
		undefined,
		"fetch component list"
	);
}

/**
 * Fetches the properties/props for a specific Dreamy UI component
 */
export async function fetchComponent(component: string): Promise<ComponentItem> {
	return fetchJson(
		createDreamyUrl(`/components/${component}.json`),
		undefined,
		`fetch component data for ${component}`
	);
}

/**
 * Fetches example code for a specific Dreamy UI component
 */
export async function fetchComponentExample(component: string): Promise<any> {
	return fetchJson(
		createDreamyUrl(`/r/examples/${component}.json`),
		undefined,
		`fetch example for component ${component}`
	);
}

/**
 * Gets the combined list of all components
 */
export async function getAllComponentNames(): Promise<string[]> {
	const componentList = await fetchComponentList();

	return componentList.map((c) => c.id); // return the slugified component name
}

/**
 * Gets the combined list of all components
 */
export async function getAllComponents(): Promise<ExtendedComponentIndexItem[]> {
	const componentList = await fetchComponentList();
	return componentList.map((c) => {
		return {
			...c,
			installCommand: `dreamy add ${c.id}`
		};
	});
}

export async function getComponentExample(component: string): Promise<string> {
	return fetchText(
		createDreamyUrl(`/docs/components/${component}.mdx`),
		undefined,
		`fetch example for component ${component}`
	);
}

/**
 * Fetches the design context from the Dreamy UI API
 */
export async function fetchRecipe(component: string) {
	return await fetchJson(
		createDreamyUrl(`/recipes/${component}.json`),
		undefined,
		"recipe fetch"
	);
}
