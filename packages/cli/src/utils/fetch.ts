import { existsSync } from "node:fs";
import { join } from "node:path";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import {
	type PatternFile,
	type RecipeFile,
	compositionFileSchema,
	compositionIndexSchema,
	patternFileSchema,
	processEnvSchema,
	recipeFileSchema
} from "./schema";

const env = processEnvSchema.parse({
	REGISTRY_URL: process.env.REGISTRY_URL || "http://localhost:3000",
	HTTPS_PROXY: process.env.HTTPS_PROXY || undefined
});

const agent = env.HTTPS_PROXY ? new HttpsProxyAgent(env.HTTPS_PROXY) : undefined;

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
): Promise<Array<{ id: string; content: string }>> {
	// First, fetch the component to get its recipeIds
	try {
		const component = await fetchComposition(componentId);

		// If component doesn't have recipes, return empty array
		if (!component.hasRecipe || !component.recipeIds || component.recipeIds.length === 0) {
			return [];
		}

		// Fetch all recipes using the recipeIds
		const recipes = await Promise.all(
			component.recipeIds.map(async (recipeId) => {
				const recipe = await fetchRecipe(recipeId);
				return recipe?.file ? { id: recipe.id, content: recipe.file.content } : null;
			})
		);

		return recipes.filter(Boolean) as Array<{
			id: string;
			content: string;
		}>;
	} catch (error) {
		console.warn(`Failed to fetch recipes for component ${componentId}`);
	}

	return [];
}

export async function getPatternForComponent(
	componentId: string,
	patternsDir: string
): Promise<Array<{ id: string; content: string }>> {
	// First, fetch the component to get its patternIds
	try {
		const component = await fetchComposition(componentId);

		// If component doesn't have patterns, return empty array
		if (!component.hasPattern || !component.patternIds || component.patternIds.length === 0) {
			return [];
		}

		// Fetch all patterns using the patternIds
		const patterns = await Promise.all(
			component.patternIds.map(async (patternId) => {
				const pattern = await fetchPattern(patternId);
				return pattern?.file ? { id: pattern.id, content: pattern.file.content } : null;
			})
		);

		return patterns.filter(Boolean) as Array<{
			id: string;
			content: string;
		}>;
	} catch (error) {
		console.warn(`Failed to fetch patterns for component ${componentId}`);
	}

	return [];
}
