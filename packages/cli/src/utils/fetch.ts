import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
	type PatternFile,
	type RecipeFile,
	compositionFileSchema,
	compositionIndexSchema,
	patternFileSchema,
	processEnvSchema,
	recipeFileSchema
} from "./schema";

const env = processEnvSchema.parse(process.env);

const agent = env.HTTPS_PROXY
	? new HttpsProxyAgent(env.HTTPS_PROXY)
	: undefined;

export async function fetchCompositions() {
	const res = await fetch(`${env.REGISTRY_URL}/components/index.json`, {
		agent
	});
	const json = await res.json();
	return compositionIndexSchema.parse(json);
}

export async function fetchComposition(id: string) {
	try {
		const res = await fetch(`${env.REGISTRY_URL}/components/${id}.json`, {
			agent
		});
		const json = await res.json();
		return compositionFileSchema.parse(json);
	} catch (error) {
		throw new Error(
			`Failed to fetch composition "${id}". Make sure the id is correct or run @dreamy-ui/cli components list to see available compositions.`
		);
	}
}

// Recipe-related functions
export async function fetchRecipes() {
	try {
		const res = await fetch(`${env.REGISTRY_URL}/recipes/index.json`, {
			agent
		});
		const json = await res.json();
		return json as Array<{ type: string; id: string; file: string }>;
	} catch (error) {
		console.warn("Failed to fetch recipes from registry");
		return [];
	}
}

// Pattern-related functions
export async function fetchPatterns() {
	try {
		const res = await fetch(`${env.REGISTRY_URL}/patterns/index.json`, {
			agent
		});
		const json = await res.json();
		return json as Array<{ type: string; id: string; file: string }>;
	} catch (error) {
		console.warn("Failed to fetch patterns from registry");
		return [];
	}
}

export async function fetchRecipe(id: string): Promise<RecipeFile | null> {
	try {
		const res = await fetch(`${env.REGISTRY_URL}/recipes/${id}.json`, {
			agent
		});
		const json = await res.json();
		return recipeFileSchema.parse(json);
	} catch (error) {
		console.warn(`Failed to fetch recipe "${id}" from registry`);
		return null;
	}
}

export async function fetchPattern(id: string): Promise<PatternFile | null> {
	try {
		const res = await fetch(`${env.REGISTRY_URL}/patterns/${id}.json`, {
			agent
		});
		const json = await res.json();
		return patternFileSchema.parse(json);
	} catch (error) {
		console.warn(`Failed to fetch pattern "${id}" from registry`);
		return null;
	}
}

function checkForRecipeOrPattern(file: string, dir: string) {
	const filePath = join(dir, file);
	return existsSync(filePath);
}

export async function getRecipeForComponent(
	componentId: string,
	recipesDir: string
): Promise<{ id: string; content: string } | null> {
	// First, fetch the component to get its recipeId
	try {
		const component = await fetchComposition(componentId);

		// If component doesn't have a recipe, return null
		if (!component.hasRecipe || !component.recipeId) {
			return null;
		}

		// Fetch the recipe using the actual recipeId
		const recipe = await fetchRecipe(component.recipeId);
		if (recipe?.file) {
			return { id: recipe.id, content: recipe.file.content };
		}
	} catch (error) {
		console.warn(`Failed to fetch recipe for component ${componentId}`);
	}

	return null;
}

export async function getPatternForComponent(
	componentId: string,
	patternsDir: string
): Promise<{ id: string; content: string } | null> {
	// First, fetch the component to get its patternId
	try {
		const component = await fetchComposition(componentId);

		// If component doesn't have a pattern, return null
		if (!component.hasPattern || !component.patternId) {
			return null;
		}

		// Fetch the pattern using the actual patternId
		const pattern = await fetchPattern(component.patternId);
		if (pattern?.file) {
			return { id: pattern.id, content: pattern.file.content };
		}
	} catch (error) {
		console.warn(`Failed to fetch pattern for component ${componentId}`);
	}

	return null;
}
