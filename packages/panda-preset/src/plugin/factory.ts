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

    factoryFileContent = factoryFileContent.replace(
        `import type { ElementType, JSX, ComponentPropsWithRef, ComponentType, Component } from 'react'`,
        `import type { ElementType, ReactNode, JSX, ComponentPropsWithRef, ComponentType, Component } from 'react'`
    );

    factoryFileContent = factoryFileContent.replace(
        `export interface AsProps {
  /**
   * The element to render as
   */
  as?: ElementType | undefined
}`,
        `export interface AsProps {
  /**
   * The element to render as
   */
  as?: ElementType | ReactNode | undefined
  /**
   * If \`true\`, the component will render the child as a component.
   * @default false
   */
  asChild?: boolean;
}`
    );

    await fs.writeFile(factoryFile, factoryFileContent);
}

const factoryFileNewContent = `import { Children, cloneElement, createElement, forwardRef, isValidElement, useMemo } from "react";
import { css, cva, cx } from "../css/index.js";
import { normalizeHTMLProps, splitProps } from "../helpers.js";
import {
    composeCvaFn,
    composeShouldForwardProps,
    defaultShouldForwardProp,
    getDisplayName
} from "./factory-helper.js";
import { isCssProperty } from "./is-valid-prop.js";

function objectToDeps(obj) {
    return Object.entries(obj).map(([key, value]) => \`\${key}:\${value}\`);
}

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

function styledFn(Dynamic, configOrCva = {}, options = {}) {
    const cvaFn = configOrCva.__cva__ || configOrCva.__recipe__ ? configOrCva : cva(configOrCva);

    const forwardFn = options.shouldForwardProp || defaultShouldForwardProp;
    const shouldForwardProp = (prop) => {
        if (options.forwardProps?.includes(prop)) return true;
        return forwardFn(prop, cvaFn.variantKeys);
    };

    const defaultProps = Object.assign(
        options.dataAttr && configOrCva.__name__ ? { "data-recipe": configOrCva.__name__ } : {},
        options.defaultProps
    );

    const __cvaFn__ = composeCvaFn(Dynamic?.__cva__, cvaFn);
    const __shouldForwardProps__ = composeShouldForwardProps(Dynamic, shouldForwardProp);
    const __base__ = Dynamic?.__base__ || Dynamic;

    const DreamyComponent = /* @__PURE__ */ forwardRef(function DreamyComponent(props, ref) {
        const { as: Element = __base__, unstyled, children, asChild, ...restProps } = props;

        const combinedProps = useMemo(
            () => Object.assign({}, defaultProps, restProps),
            objectToDeps(restProps)
        );

        const [htmlProps, forwardedProps, variantProps, styleProps, elementProps] = useMemo(() => {
            return splitProps(
                combinedProps,
                normalizeHTMLProps.keys,
                __shouldForwardProps__,
                __cvaFn__.variantKeys,
                isCssProperty
            );
        }, [combinedProps]);

        function recipeClass() {
            const { css: cssStyles, ...propStyles } = styleProps;
            const compoundVariantStyles = __cvaFn__.__getCompoundVariantCss__?.(variantProps);
            return cx(
                __cvaFn__(variantProps, false),
                css(compoundVariantStyles, propStyles, cssStyles),
                combinedProps.className
            );
        }

        function cvaClass() {
            const { css: cssStyles, ...propStyles } = styleProps;
            const cvaStyles = __cvaFn__.raw(variantProps);
            return cx(css(cvaStyles, propStyles, cssStyles), combinedProps.className);
        }

        function classes() {
            if (unstyled) {
                const { css: cssStyles, ...propStyles } = styleProps;
                return cx(css(propStyles, cssStyles), combinedProps.className);
            }
            return configOrCva.__recipe__ ? recipeClass() : cvaClass();
        }

        if (asChild) {
            const onlyChild = Children.only(children);

            if (!isValidElement(onlyChild)) {
                return null;
            }

            return cloneElement(onlyChild, {
                ref: onlyChild?.ref ? composeRefs(ref, onlyChild?.ref) : ref,
                ...forwardedProps,
                ...elementProps,
                ...normalizeHTMLProps(htmlProps),
                ...(onlyChild?.props || {}),
                className: classes()
            });
        }

        if (typeof Element === "object" && !("render" in Element) && Element !== null) {
            return createElement(
                Element?.type || __base__,
                {
                    ref: Element?.ref ? composeRefs(ref, Element?.ref) : ref,
                    ...forwardedProps,
                    ...elementProps,
                    ...normalizeHTMLProps(htmlProps),
                    ...(Element?.props || {}),
                    className: classes()
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
                ...normalizeHTMLProps(htmlProps),
                className: classes()
            },
            children ?? combinedProps.children
        );
    });

    const name = getDisplayName(__base__);

    DreamyComponent.displayName = \`dreamy.\${name}\`;
    DreamyComponent.__cva__ = __cvaFn__;
    DreamyComponent.__base__ = __base__;
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
            if (!cache.has(el)) {
                cache.set(el, styledFn(el));
            }
            return cache.get(el);
        }
    });
}

export const dreamy = /* @__PURE__ */ createJsxFactory();
`;
