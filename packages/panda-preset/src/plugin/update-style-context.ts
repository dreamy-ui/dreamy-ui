import fs from "node:fs/promises";
import path from "node:path";

const createStyleContextSource = `"use client";

import { createContext, createElement, forwardRef, useContext } from "react";
import { cx, sva } from "../css/index.js";
import { dreamy } from "./factory.js";
import { getDisplayName } from "./helper.js";

function createSafeContext(contextName) {
    const Context = createContext(undefined);
    const useStyleContext = (componentName, slot) => {
        const context = useContext(Context);
        if (context === undefined) {
            const componentInfo = componentName ? \`Component "\${componentName}"\` : "A component";
            const slotInfo = slot ? \` (slot: "\${slot}")\` : "";
            throw new Error(
                \`\${componentInfo}\${slotInfo} cannot access \${contextName} because it's missing its Provider.\`
            );
        }
        return context;
    };
    return [Context, useStyleContext];
}

function resolveSlotRecipe(recipe) {
    if (recipe == null) throw new Error("createStyleContext requires a slot recipe");
    if (typeof recipe.splitVariantProps === "function") return recipe;
    if (recipe.slots) return recipe;
    throw new Error("createStyleContext requires a slot recipe");
}

export function createStyleContext(recipeInput, styleContextOptions = {}) {
    const forwardVariants = styleContextOptions.forwardVariants ?? [];
    const recipe = resolveSlotRecipe(recipeInput);
    const isRuntimeRecipe = typeof recipe.splitVariantProps === "function";
    const isConfigRecipe = isRuntimeRecipe && recipe.__recipe__ !== undefined;
    const recipeName = isRuntimeRecipe && recipe.__name__ ? recipe.__name__ : undefined;
    const contextName = recipeName ? \`createStyleContext("\${recipeName}")\` : "createStyleContext";
    const [SlotStylesContext, useSlotStylesContext] = createSafeContext(contextName);
    const slotRecipeFn = isRuntimeRecipe ? recipe : sva(recipe.config ?? recipe);

    function getForwardedVariantProps(variantProps) {
        if (!forwardVariants.length) return {};
        return forwardVariants.reduce((accumulator, variantKey) => {
            if (variantProps[variantKey] !== undefined) {
                accumulator[variantKey] = variantProps[variantKey];
            }
            return accumulator;
        }, {});
    }

    const resolveProps = (props, slotStyles) => {
        const { unstyled, ...restProps } = props;
        if (unstyled) return restProps;
        if (isConfigRecipe) return { ...restProps, className: cx(slotStyles, restProps.className) };
        return { ...slotStyles, ...restProps };
    };

    const withRootProvider = (Component, options) => {
        const WithRootProvider = (props) => {
            const [variantProps, otherProps] = slotRecipeFn.splitVariantProps(props);
            const forwardedVariantProps = getForwardedVariantProps(variantProps);
            const resolvedSlots = isConfigRecipe ? slotRecipeFn(variantProps) : slotRecipeFn.raw(variantProps);
            const mergedProps = options?.defaultProps
                ? { ...options.defaultProps, ...otherProps, ...forwardedVariantProps }
                : { ...otherProps, ...forwardedVariantProps };
            return createElement(SlotStylesContext.Provider, {
                value: resolvedSlots,
                children: createElement(Component, mergedProps)
            });
        };
        const componentName = getDisplayName(Component);
        WithRootProvider.displayName = \`withRootProvider(\${componentName})\`;
        return WithRootProvider;
    };

    const withProvider = (Component, slot, options) => {
        const StyledComponent = dreamy(Component, {}, options);
        const WithProvider = forwardRef(function WithProvider(props, ref) {
            const [variantProps, restProps] = slotRecipeFn.splitVariantProps(props);
            const forwardedVariantProps = getForwardedVariantProps(variantProps);
            const resolvedSlots = isConfigRecipe ? slotRecipeFn(variantProps) : slotRecipeFn.raw(variantProps);
            if (restProps.className == null && options?.defaultProps?.className) {
                restProps.className = options.defaultProps.className;
            }
            const resolvedProps = resolveProps(
                { ...restProps, ...forwardedVariantProps },
                resolvedSlots[slot]
            );
            options?.forwardProps?.forEach((key) => {
                if (key in variantProps) resolvedProps[key] = variantProps[key];
            });
            return createElement(SlotStylesContext.Provider, {
                value: resolvedSlots,
                children: createElement(StyledComponent, {
                    ...resolvedProps,
                    "data-slot": slot,
                    ref
                })
            });
        });
        const componentName = getDisplayName(Component);
        WithProvider.displayName = \`withProvider(\${componentName})\`;
        return WithProvider;
    };

    const withContext = (Component, slot, options) => {
        const StyledComponent = dreamy(Component, {}, options);
        const componentName = getDisplayName(Component);
        const WithContext = forwardRef(function WithContext(props, ref) {
            const resolvedSlots = useSlotStylesContext(componentName, slot);
            const nextProps =
                props.className == null && options?.defaultProps?.className
                    ? { ...props, className: options.defaultProps.className }
                    : props;
            const resolvedProps = resolveProps(nextProps, resolvedSlots[slot]);
            return createElement(StyledComponent, {
                ...resolvedProps,
                "data-slot": slot,
                ref
            });
        });
        WithContext.displayName = \`withContext(\${componentName})\`;
        return WithContext;
    };

    return {
        withRootProvider,
        withProvider,
        withContext
    };
}
`;

export async function writeDreamyStyleContext(jsxFolder: string) {
    await fs.writeFile(path.join(jsxFolder, "create-style-context.js"), createStyleContextSource);
}

export async function updateStyleContextTypes(jsxFolder: string) {
    const slotDts = path.join(jsxFolder, "create-slot-recipe-context.d.ts");
    const dtsPath = path.join(jsxFolder, "create-style-context.d.ts");

    let content: string;
    try {
        content = await fs.readFile(slotDts, "utf-8");
    } catch {
        try {
            content = await fs.readFile(dtsPath, "utf-8");
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
            throw error;
        }
    }

    content = content.replace(/createSlotRecipeContext/g, "createStyleContext");
    content = content.replace(/SlotRecipeContextInput/g, "StyleContextInput");
    content = content.replace(/SlotRecipeContext/g, "StyleContext");

    if (!content.includes("| RecipeRuntimeFn<")) {
        content = content.replace(
            "import type { RecipeSelection",
            "import type { RecipeRuntimeFn, RecipeSelection"
        );
        content = content.replace(
            "type StyleContextInput = SlotRecipeRuntimeFn<string, any, any> | RuntimeSlotRecipeFn | AnySlotRecipeDefinition",
            "type StyleContextInput = SlotRecipeRuntimeFn<string, any, any> | RuntimeSlotRecipeFn | AnySlotRecipeDefinition | RecipeRuntimeFn<any, any>"
        );
        content = content.replace(
            `: R extends SlotRecipeRuntimeFn<any, infer P, any>
    ? P
    : R extends SlotRecipeDefinition<any, infer T>`,
            `: R extends SlotRecipeRuntimeFn<any, infer P, any>
    ? P
    : R extends RecipeRuntimeFn<infer P, any>
      ? P
    : R extends SlotRecipeDefinition<any, infer T>`
        );
    }

    if (!content.includes("interface StyleContextOptions")) {
        content = content.replace(
            "export interface StyleContext<R extends StyleContextInput>",
            `interface StyleContextOptions {
  forwardVariants?: string[] | undefined
}

export interface StyleContext<R extends StyleContextInput>`
        );
    }

    content = content.replace(
        "export declare function createStyleContext<R extends StyleContextInput>(recipe: R): StyleContext<R>",
        "export declare function createStyleContext<R extends StyleContextInput>(recipe: R, options?: StyleContextOptions | undefined): StyleContext<R>"
    );

    await fs.writeFile(dtsPath, content);
}
