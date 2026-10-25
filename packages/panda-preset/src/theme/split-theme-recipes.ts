export interface ThemeRecipeLike {
    slots?: readonly string[];
}

export interface SplitThemeRecipes<T extends Record<string, ThemeRecipeLike>> {
    recipes: Partial<T>;
    slotRecipes: Partial<T>;
}

/**
 * Panda v2 only emits slot CSS for definitions under `theme.slotRecipes`.
 * `defineSlotRecipe` configs include a `slots` array; everything else stays a recipe.
 */
export function splitThemeRecipes<T extends Record<string, ThemeRecipeLike>>(
    definitions: T
): SplitThemeRecipes<T> {
    const recipes: Partial<T> = {};
    const slotRecipes: Partial<T> = {};

    for (const name of Object.keys(definitions) as Array<keyof T & string>) {
        const definition = definitions[name];
        if (definition && Array.isArray(definition.slots)) {
            slotRecipes[name] = definition;
        } else {
            recipes[name] = definition;
        }
    }

    return { recipes, slotRecipes };
}
