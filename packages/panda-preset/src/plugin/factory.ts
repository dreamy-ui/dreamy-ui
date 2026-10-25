import fs from "node:fs/promises";
import path from "node:path";

export async function updateFactory(jsxFolder: string, typesFolder: string) {
    await Promise.all([updateFactoryFile(jsxFolder), updateFactoryTypes(typesFolder)]);
}

async function updateFactoryFile(jsxFolder: string) {
    const factoryFile = path.join(jsxFolder, "factory.js");
    await fs.writeFile(factoryFile, factoryFileNewContent);
}

async function updateFactoryTypes(typesFolder: string) {
    const factoryFile = path.join(typesFolder, "jsx.d.ts");
    let factoryFileContent = await fs.readFile(factoryFile, "utf8");

    if (!factoryFileContent.includes("asChild")) {
        factoryFileContent = factoryFileContent.replace(
            /import type \{([^}]+)\} from 'react'/,
            (match, imports: string) => {
                if (imports.includes("ReactNode")) return match;
                return `import type {${imports}, ReactNode} from 'react'`;
            }
        );

        factoryFileContent = factoryFileContent.replace(
            /export interface AsProps \{\s*as\?: ElementType \| undefined\s*\}/,
            `export interface AsProps {
  as?: ElementType | ReactNode | undefined
  asChild?: boolean | undefined
}`
        );
    }

    await fs.writeFile(factoryFile, factoryFileContent);
}

const factoryFileNewContent = `import { Children, cloneElement, createElement, forwardRef, isValidElement, useMemo } from "react";
import { cx, cva } from "../css/index.js";
import {
    composeCvaFn,
    composeShouldForwardProps,
    getDisplayName,
    serializeSplitStyles,
    splitJsxProps
} from "./helper.js";
import { isCssProperty } from "./is-valid-prop.js";

function setRef(ref, value) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref !== null && ref !== undefined) {
        ref.current = value;
    }
}

function composeRefs(...refs) {
    return (node) => {
        for (const ref of refs) setRef(ref, node);
    };
}

const dreamyProprietaryProps = new Set([
    "onChangeValue",
    "onChangeStart",
    "onChangeEnd",
    "isInvalid",
    "isDisabled",
    "isRequired",
    "isReadOnly",
    "isChecked",
    "isIndeterminate",
    "isFocusable",
    "isPreviewFocusable",
    "isSelected",
    "isClearable",
    "isMultiple",
    "isNative",
    "isCard",
    "isReversed",
    "isOpen",
    "isLoading",
    "isActive",
    "reduceMotion",
    "defaultIsOpen"
]);

function styledFn(BaseComponent, recipeOrConfig = {}, options = {}) {
    const recipeFn = recipeOrConfig.__cva__ || recipeOrConfig.__recipe__ ? recipeOrConfig : cva(recipeOrConfig);
    const composedRecipeFn = composeCvaFn(BaseComponent?.__cva__, recipeFn);
    const getRaw = composedRecipeFn.__memoizedRaw__ || composedRecipeFn.raw;
    const variantKeys = composedRecipeFn.variantKeys;
    const variantSet = new Set(variantKeys);
    const forwardFn = options.shouldForwardProp || ((prop) => !variantSet.has(prop) && !isCssProperty(prop));
    const forwardProps = options.forwardProps;
    const forwardPropSet = forwardProps?.length ? new Set(forwardProps) : undefined;
    const shouldForwardProp = (prop) => {
        if (dreamyProprietaryProps.has(prop)) return false;
        if (forwardPropSet?.has(prop)) return true;
        return forwardPropSet ? forwardPropSet.has(prop) || forwardFn(prop, variantKeys) : forwardFn(prop, variantKeys);
    };

    const dataProps =
        options.dataAttr && recipeOrConfig.__name__ ? { "data-recipe": recipeOrConfig.__name__ } : {};
    const defaultProps = Object.assign(dataProps, options.defaultProps);
    const hasDefaultProps = Object.keys(defaultProps).length > 0;

    const shouldForward = composeShouldForwardProps(BaseComponent, shouldForwardProp);
    const DefaultElement = BaseComponent?.__base__ || BaseComponent;

    const DreamyComponent = /* @__PURE__ */ forwardRef(function DreamyComponent(props, ref) {
        const Element = props.as === undefined ? DefaultElement : props.as;
        const unstyled = props.unstyled;
        const children = props.children;
        const asChild = props.asChild;

        let combinedProps = props;
        if (hasDefaultProps) {
            const { as, unstyled: _u, children: _c, asChild: _a, ...restProps } = props;
            combinedProps = Object.assign({}, defaultProps, restProps);
        }

        const [htmlProps, forwardedProps, variantProps, propStyles, cssStyles, elementProps] = splitJsxProps(
            combinedProps,
            shouldForward,
            variantSet,
            isCssProperty
        );

        const hasStyles = propStyles || cssStyles !== undefined;
        let className;
        if (unstyled) {
            className = cx(hasStyles && serializeSplitStyles(propStyles, cssStyles), combinedProps.className);
        } else if (recipeOrConfig.__recipe__) {
            const compoundVariantClasses = composedRecipeFn.__getCompoundVariantClasses__?.(variantProps);
            className = cx(
                composedRecipeFn(variantProps, false),
                compoundVariantClasses,
                hasStyles && serializeSplitStyles(propStyles, cssStyles),
                combinedProps.className
            );
        } else {
            className = cx(
                hasStyles
                    ? serializeSplitStyles(propStyles, cssStyles, getRaw(variantProps))
                    : composedRecipeFn(variantProps),
                combinedProps.className
            );
        }

        if (asChild) {
            const onlyChild = Children.only(children);
            if (!isValidElement(onlyChild)) return null;
            return cloneElement(onlyChild, {
                ref: onlyChild?.ref ? composeRefs(ref, onlyChild?.ref) : ref,
                ...forwardedProps,
                ...elementProps,
                ...htmlProps,
                ...(onlyChild?.props || {}),
                className: cx(className, onlyChild?.props?.className)
            });
        }

        if (isValidElement(Element)) {
            const elementRef = Element.props?.ref ?? Element.ref;
            return cloneElement(
                Element,
                {
                    ref: elementRef ? composeRefs(ref, elementRef) : ref,
                    ...forwardedProps,
                    ...elementProps,
                    ...htmlProps,
                    className: cx(className, Element.props?.className)
                },
                children ?? Element.props.children
            );
        }

        if (typeof Element === "object" && Element !== null && !("render" in Element)) {
            return createElement(
                Element?.type || DefaultElement,
                {
                    ref: Element?.ref ? composeRefs(ref, Element?.ref) : ref,
                    ...forwardedProps,
                    ...elementProps,
                    ...htmlProps,
                    ...(Element?.props || {}),
                    className: cx(className, Element?.props?.className)
                },
                children ?? combinedProps.children
            );
        }

        return createElement(
            Element,
            {
                ref,
                ...forwardedProps,
                ...elementProps,
                ...htmlProps,
                className
            },
            children ?? combinedProps.children
        );
    });

    const name = getDisplayName(DefaultElement);
    DreamyComponent.displayName = \`dreamy.\${name}\`;
    DreamyComponent.__cva__ = composedRecipeFn;
    DreamyComponent.__base__ = DefaultElement;
    DreamyComponent.__shouldForwardProps__ = shouldForwardProp;

    return DreamyComponent;
}

function createJsxFactory() {
    const cache = new Map();
    return new Proxy(styledFn, {
        apply(_, __, args) {
            return styledFn(...args);
        },
        get(_, el) {
            if (!cache.has(el)) cache.set(el, styledFn(el));
            return cache.get(el);
        }
    });
}

export const dreamy = /* @__PURE__ */ createJsxFactory();
`;
