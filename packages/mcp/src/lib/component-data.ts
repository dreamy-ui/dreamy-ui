import {
	type ComponentItem,
	fetchComponentSafe,
	fetchPatternSafe,
	fetchRecipeSafe,
	type RegistryFile
} from "./fetch.js";

export interface ComponentStyleSource {
	id: string;
	file: RegistryFile;
}

export interface ComponentData {
	id: string;
	component: string;
	installCommand: string;
	npmDependencies: string[];
	fileDependencies: string[];
	hasRecipe: boolean;
	hasPattern: boolean;
	recipeIds: string[];
	patternIds: string[];
	source: RegistryFile;
	recipes: ComponentStyleSource[];
	patterns: ComponentStyleSource[];
	warnings: string[];
}

async function fetchStyleSources(
	ids: string[] | undefined,
	fetcher: (id: string) => ReturnType<typeof fetchRecipeSafe>
): Promise<{ sources: ComponentStyleSource[]; warnings: string[] }> {
	if (!ids?.length) {
		return { sources: [], warnings: [] };
	}

	const results = await Promise.all(
		ids.map(async (id) => {
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

function toComponentData(
	component: ComponentItem,
	recipes: ComponentStyleSource[],
	patterns: ComponentStyleSource[],
	warnings: string[]
): ComponentData {
	return {
		id: component.id,
		component: component.component,
		installCommand: `dreamy add ${component.id}`,
		npmDependencies: component.npmDependencies ?? [],
		fileDependencies: component.fileDependencies ?? [],
		hasRecipe: component.hasRecipe,
		hasPattern: component.hasPattern,
		recipeIds: component.recipeIds ?? [],
		patternIds: component.patternIds ?? [],
		source: component.file,
		recipes,
		patterns,
		warnings
	};
}

export async function getComponentData(
	componentId: string
): Promise<{ ok: true; data: ComponentData } | { ok: false; error: string }> {
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
		data: toComponentData(component, recipeResult.sources, patternResult.sources, [
			...recipeResult.warnings,
			...patternResult.warnings
		])
	};
}
