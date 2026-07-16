import {
	type ComponentItem,
	fetchComponentSafe,
	fetchDocsSafe,
	fetchPatternSafe,
	fetchRecipeSafe,
	type RegistryFile
} from "./fetch.js";
import { getPrimaryExample, parseDocs, type ParsedDocs } from "./parse-docs.js";
import {
	parseComponentExports,
	parseComponentProps,
	selectPrimaryInterfaces,
	type ParsedExport,
	type ParsedInterface
} from "./parse-props.js";
import {
	parsePattern,
	parseRecipe,
	type ParsedPattern,
	type ParsedRecipe
} from "./parse-recipe.js";

export interface ComponentStyleSource {
	id: string;
	file: RegistryFile;
}

export interface ComponentReference {
	id: string;
	component: string;
	description?: string;
	docsUrl: string;
	installCommand: string;
	npmDependencies: string[];
	fileDependencies: string[];
	hasRecipe: boolean;
	hasPattern: boolean;
	exports: ParsedExport[];
	interfaces: ParsedInterface[];
	recipe: ParsedRecipe | null;
	pattern: ParsedPattern | null;
	docs: ParsedDocs | null;
	primaryExampleCode?: string;
	warnings: string[];
}

export interface ComponentSourceBundle {
	id: string;
	component: string;
	installCommand: string;
	source: RegistryFile;
	recipes: ComponentStyleSource[];
	patterns: ComponentStyleSource[];
	warnings: string[];
}

function docsUrlFor(componentId: string): string {
	return `https://dreamy-ui.com/docs/components/${componentId}`;
}

async function fetchStyleSources(
	ids: string[] | undefined,
	fetcher: (id: string) => ReturnType<typeof fetchRecipeSafe>
): Promise<{ sources: ComponentStyleSource[]; warnings: string[] }> {
	if (!ids?.length) {
		return { sources: [], warnings: [] };
	}

	const results = await Promise.all(
		ids.map(async function (id) {
			const result = await fetcher(id);

			if (!result.ok) {
				return {
					warning: `Failed to fetch style source "${id}": ${result.error}`
				};
			}

			return {
				source: {
					id: result.data.id,
					file: result.data.file
				}
			};
		})
	);

	const sources: ComponentStyleSource[] = [];
	const warnings: string[] = [];

	for (const result of results) {
		if ("warning" in result && result.warning) {
			warnings.push(result.warning);
			continue;
		}

		if ("source" in result && result.source) {
			sources.push(result.source);
		}
	}

	return { sources, warnings };
}

function buildReference(
	component: ComponentItem,
	recipes: ComponentStyleSource[],
	patterns: ComponentStyleSource[],
	docs: ParsedDocs | null,
	warnings: string[]
): ComponentReference {
	const source = component.file.content;
	const interfaces = selectPrimaryInterfaces(
		parseComponentProps(source),
		component.component
	);
	const exportsList = parseComponentExports(source);

	const recipe =
		recipes[0] != null ? parseRecipe(recipes[0].id, recipes[0].file.content) : null;
	const pattern =
		patterns[0] != null ? parsePattern(patterns[0].id, patterns[0].file.content) : null;

	const description =
		docs?.frontmatter.description ??
		recipe?.description ??
		undefined;

	const primaryExample = docs ? getPrimaryExample(docs) : undefined;

	return {
		id: component.id,
		component: component.component,
		description,
		docsUrl: docsUrlFor(component.id),
		installCommand: `dreamy add ${component.id}`,
		npmDependencies: component.npmDependencies ?? [],
		fileDependencies: component.fileDependencies ?? [],
		hasRecipe: component.hasRecipe,
		hasPattern: component.hasPattern,
		exports: exportsList,
		interfaces,
		recipe,
		pattern,
		docs,
		primaryExampleCode: primaryExample?.code,
		warnings
	};
}

export async function getComponentReference(
	componentId: string
): Promise<{ ok: true; data: ComponentReference } | { ok: false; error: string }> {
	const componentResult = await fetchComponentSafe(componentId);

	if (!componentResult.ok) {
		return {
			ok: false,
			error: `Failed to fetch component "${componentId}": ${componentResult.error}`
		};
	}

	const component = componentResult.data;
	const [recipeResult, patternResult, docsResult] = await Promise.all([
		fetchStyleSources(component.recipeIds, fetchRecipeSafe),
		fetchStyleSources(component.patternIds, fetchPatternSafe),
		fetchDocsSafe(componentId)
	]);

	const warnings = [...recipeResult.warnings, ...patternResult.warnings];
	let docs: ParsedDocs | null = null;

	if (docsResult.ok) {
		docs = parseDocs(docsResult.data);
	} else {
		warnings.push(`Docs unavailable: ${docsResult.error}`);
	}

	return {
		ok: true,
		data: buildReference(
			component,
			recipeResult.sources,
			patternResult.sources,
			docs,
			warnings
		)
	};
}

export async function getComponentSourceBundle(
	componentId: string
): Promise<{ ok: true; data: ComponentSourceBundle } | { ok: false; error: string }> {
	const componentResult = await fetchComponentSafe(componentId);

	if (!componentResult.ok) {
		return {
			ok: false,
			error: `Failed to fetch component "${componentId}": ${componentResult.error}`
		};
	}

	const component = componentResult.data;
	const [recipeResult, patternResult] = await Promise.all([
		fetchStyleSources(component.recipeIds, fetchRecipeSafe),
		fetchStyleSources(component.patternIds, fetchPatternSafe)
	]);

	return {
		ok: true,
		data: {
			id: component.id,
			component: component.component,
			installCommand: `dreamy add ${component.id}`,
			source: component.file,
			recipes: recipeResult.sources,
			patterns: patternResult.sources,
			warnings: [...recipeResult.warnings, ...patternResult.warnings]
		}
	};
}

/** @deprecated Use getComponentReference */
export async function getComponentData(componentId: string) {
	return getComponentSourceBundle(componentId);
}
