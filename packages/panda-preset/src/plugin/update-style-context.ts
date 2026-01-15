import fs from "node:fs/promises";
import path from "node:path";

export async function removeFactoryFromStyleContext(jsxFolder: string) {
    const files = await fs.readdir(jsxFolder).then(files => files.filter(file => !file.endsWith("d.ts")));
    const styleContextFile = files.find((file) => file.startsWith("create-style-context"));
	console.log("styleContextFile", styleContextFile);

    if (!styleContextFile) {
        throw new Error(`create-style-context.js file not found in ${jsxFolder}`);
    }

    const newContent = `"use client";

import { createContext, createElement, forwardRef, useContext } from "react";
import { css, cx, sva } from "../css/index.js";
import { getDisplayName } from "./factory-helper.js";
import { dreamy } from "./factory.js";

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

export function createStyleContext(recipe) {
    const isConfigRecipe = "__recipe__" in recipe;
    const recipeName = isConfigRecipe && recipe.__name__ ? recipe.__name__ : undefined;
    const contextName = recipeName ? \`createStyleContext("\${recipeName}")\` : "createStyleContext";

    const [StyleContext, useStyleContext] = createSafeContext(contextName);
    const svaFn = isConfigRecipe ? recipe : sva(recipe.config);

    const getResolvedProps = (props, slotStyles) => {
        const { unstyled, ...restProps } = props;
        if (unstyled) return restProps;
        if (isConfigRecipe) {
            return { ...restProps, className: cx(slotStyles, restProps.className) };
        }
        return { ...slotStyles, ...restProps };
    };

    const withRootProvider = (Component, options) => {
        const WithRootProvider = (props) => {
            const [variantProps, otherProps] = svaFn.splitVariantProps(props);

            const slotStyles = isConfigRecipe ? svaFn(variantProps) : svaFn.raw(variantProps);
            slotStyles._classNameMap = svaFn.classNameMap;

            const mergedProps = options?.defaultProps
                ? { ...options.defaultProps, ...otherProps }
                : otherProps;

            return createElement(StyleContext.Provider, {
                value: slotStyles,
                children: createElement(Component, mergedProps)
            });
        };

        const componentName = getDisplayName(Component);
        WithRootProvider.displayName = \`withRootProvider(\${componentName})\`;

        return WithRootProvider;
    };

    const withProvider = (Component, slot, options) => {
        const WithProvider = forwardRef((props, ref) => {
            const [variantProps, restProps] = svaFn.splitVariantProps(props);

            const slotStyles = isConfigRecipe ? svaFn(variantProps) : svaFn.raw(variantProps);
            slotStyles._classNameMap = svaFn.classNameMap;

            const propsWithClass = {
                ...restProps,
                ...options?.defaultProps,
                className: restProps.className ?? options?.defaultProps?.className
            };
            const resolvedProps = getResolvedProps(propsWithClass, slotStyles[slot]);
            return createElement(StyleContext.Provider, {
                value: slotStyles,
                children: createElement(Component, {
                    ...resolvedProps,
                    className: cx(resolvedProps.className, slotStyles._classNameMap[slot]),
                    ref
                })
            });
        });

        const componentName = getDisplayName(Component);
        WithProvider.displayName = \`withProvider(\${componentName})\`;

        return WithProvider;
    };

    const withContext = (Component, slot, options) => {
        const componentName = getDisplayName(Component);

        const WithContext = forwardRef((props, ref) => {
            const slotStyles = useStyleContext(componentName, slot);

            const propsWithClass = {
                ...props,
                ...options?.defaultProps,
                className: props.className ?? options?.defaultProps?.className
            };
            const resolvedProps = getResolvedProps(propsWithClass, slotStyles[slot]);
            return createElement(Component, {
                ...resolvedProps,
                className: cx(resolvedProps.className, slotStyles._classNameMap[slot]),
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

    await fs.writeFile(path.join(jsxFolder, styleContextFile), newContent);
}
