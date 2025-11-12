import { objectToDeps } from "@dreamy-ui/react";
import type React from "react";
import {
    type ComponentPropsWithoutRef,
    type ElementType,
    type FunctionComponent,
    createElement,
    forwardRef,
    useMemo
} from "react";
import { css, cva, cx } from "styled-system/css";
import { splitProps } from "styled-system/helpers";
import { isCssProperty } from "styled-system/jsx";
import type {
    Assign,
    DistributiveOmit,
    DistributiveUnion,
    JsxRecipeProps,
    JsxStyleProps,
    Pretty,
    RecipeDefinition,
    RecipeSelection,
    RecipeVariantRecord,
    UnstyledProps
} from "styled-system/types";

type DreamPropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>;

interface RecipeFn {
    __type: any;
}

interface JsxFactoryOptions<TProps extends Dict> {
    dataAttr?: boolean;
    defaultProps?: TProps;
    shouldForwardProp?(prop: string, variantKeys: string[]): boolean;
}

// function withAsProps(Component: React.ElementType) {
//     const Comp = memo(
//         forwardRef<unknown, DreamPropsWithRef<typeof Component>>(
//             (props: DreamPropsWithRef<typeof Component>, ref) => {
//                 const { asChild, asComp, children, ...restProps } = props;

//                 if (asComp) {
//                     return createElement(
//                         asComp.type,
//                         {
//                             ...restProps,
//                             ...asComp.props,
//                             ref: "ref" in asComp ? composeRefs(ref, asComp.ref) : ref
//                         },
//                         children
//                     );
//                 }

//                 if (!asChild) {
//                     return createElement(Component, { ...restProps, ref }, children);
//                 }

//                 const onlyChild = Children.only(children) as React.ReactElement;

//                 if (!isValidElement(onlyChild)) {
//                     return null;
//                 }

//                 const childRef = getRef(onlyChild);

//                 return cloneElement(onlyChild, {
//                     ...restProps,
//                     ...(onlyChild.props as object),
//                     ref: ref ? composeRefs(ref, childRef) : childRef
//                 });
//             }
//         )
//     );

//     // @ts-expect-error - it exists
//     Comp.displayName = Component.displayName || Component.name;

//     return Comp;
// }

const htmlProps = ["htmlSize", "htmlTranslate", "htmlWidth", "htmlHeight"];
function convert(key: string) {
    return htmlProps.includes(key) ? key.replace("html", "").toLowerCase() : key;
}
function normalizeHTMLProps(props: any) {
    return Object.fromEntries(Object.entries(props).map(([key, value]) => [convert(key), value]));
}
normalizeHTMLProps.keys = htmlProps;

export const defaultShouldForwardProp = (prop: string, variantKeys: string[]) =>
    !variantKeys.includes(prop) && !isCssProperty(prop);

const composeShouldForwardProps = (tag: any, shouldForwardProp: any) =>
    tag.__shouldForwardProps__ && shouldForwardProp
        ? (propName: string) => tag.__shouldForwardProps__(propName) && shouldForwardProp(propName)
        : shouldForwardProp;

const composeCvaFn = (cvaA: any, cvaB: any) => {
    if (cvaA && !cvaB) return cvaA;
    if (!cvaA && cvaB) return cvaB;
    if ((cvaA.__cva__ && cvaB.__cva__) || (cvaA.__recipe__ && cvaB.__recipe__))
        return cvaA.merge(cvaB);
    const error = new TypeError("Cannot merge cva with recipe. Please use either cva or recipe.");
    TypeError.captureStackTrace?.(error);
    throw error;
};

const getDisplayName = (Component: any) => {
    if (typeof Component === "string") return Component;
    return Component?.displayName || Component?.name || "Component";
};

function styledFn(Dynamic: any, configOrCva: any = {}, options: any = {}) {
    const cvaFn = configOrCva.__cva__ || configOrCva.__recipe__ ? configOrCva : cva(configOrCva);

    const forwardFn = options.shouldForwardProp || defaultShouldForwardProp;
    const shouldForwardProp = (prop: string) => {
        if (options.forwardProps?.includes(prop)) return true;
        return forwardFn(prop, cvaFn.variantKeys);
    };

    const defaultProps = Object.assign(
        options.dataAttr && configOrCva.__name__ ? { "data-recipe": configOrCva.__name__ } : {},
        options.defaultProps
    );

    const __cvaFn__ = composeCvaFn(Dynamic?.__cva__, cvaFn);
    const __shouldForwardProps__ = composeShouldForwardProps(Dynamic, shouldForwardProp);
    const __base__ = Dynamic?.__base__ || Dynamic || "div";

    const DreamyComponent = /* @__PURE__ */ forwardRef<any, any>(
        function DreamyComponent(props, ref) {
            const { as: Element = __base__, unstyled, children, ...restProps } = props;

            // Ensure Element is always valid
            const ValidElement = Element || __base__ || "div";

            // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
            const combinedProps = useMemo(
                () => Object.assign({}, defaultProps, restProps),
                [...objectToDeps(restProps)]
            );

            const [htmlProps, forwardedProps, variantProps, styleProps, elementProps] =
                useMemo(() => {
                    return splitProps(
                        combinedProps,
                        normalizeHTMLProps.keys,
                        __shouldForwardProps__,
                        __cvaFn__.variantKeys,
                        isCssProperty
                    );
                }, [combinedProps]);

            function recipeClass() {
                const { css: cssStyles, ...propStyles } = styleProps as any;
                const compoundVariantStyles = __cvaFn__.__getCompoundVariantCss__?.(variantProps);
                return cx(
                    __cvaFn__(variantProps, false),
                    css(compoundVariantStyles, propStyles, cssStyles),
                    combinedProps.className
                );
            }

            function cvaClass() {
                const { css: cssStyles, ...propStyles } = styleProps as any;
                const cvaStyles = __cvaFn__.raw(variantProps);
                return cx(css(cvaStyles, propStyles, cssStyles), combinedProps.className);
            }

            const classes = () => {
                if (unstyled) {
                    const { css: cssStyles, ...propStyles } = styleProps as any;
                    return cx(css(propStyles, cssStyles), combinedProps.className);
                }
                return configOrCva.__recipe__ ? recipeClass() : cvaClass();
            };

            return createElement(
                ValidElement,
                {
                    ref,
                    ...forwardedProps,
                    ...elementProps,
                    ...normalizeHTMLProps(htmlProps),
                    className: classes()
                },
                children ?? combinedProps.children
            );
        }
    );

    const name = getDisplayName(__base__);

    DreamyComponent.displayName = `dreamy.${name}`;
    (DreamyComponent as any).__cva__ = __cvaFn__;
    (DreamyComponent as any).__base__ = __base__;
    (DreamyComponent as any).__shouldForwardProps__ = shouldForwardProp;

    return DreamyComponent;
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export type JsxElement<T extends ElementType, P extends Dict> = T extends DreamyComponent<
    infer A,
    infer B
>
    ? DreamyComponent<A, Pretty<DistributiveUnion<P, B>>>
    : DreamyComponent<T, P>;

interface DreamFactory {
    <T extends ElementType>(component: T): DreamyComponent<T, {}>;
    <T extends ElementType, P extends RecipeVariantRecord>(
        component: T,
        recipe: RecipeDefinition<P>,
        options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>
    ): JsxElement<T, RecipeSelection<P>>;
    <T extends ElementType, P extends RecipeFn>(
        component: T,
        recipeFn: P,
        options?: JsxFactoryOptions<JsxRecipeProps<T, P["__type"]>>
    ): JsxElement<T, P["__type"]>;
}

type JsxElements = {
    [K in keyof React.JSX.IntrinsicElements]: DreamyComponent<K, {}>;
};

export type Dreamy = DreamFactory & JsxElements;

// function styledWithAsProps<T extends ElementType, P extends RecipeVariantRecord>(
//     Component: T,
//     recipe?: RecipeDefinition<P>,
//     options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>
// ): DreamyComponent<T, {}>;
// function styledWithAsProps<T extends ElementType, P extends RecipeFn>(
//     Component: T,
//     recipe?: P,
//     options?: JsxFactoryOptions<JsxRecipeProps<T, P["__type"]>>
// ): DreamyComponent<T, P["__type"]> {
//     return styledFn(Component, recipe as any, options) as any;
// }

function createJsxFactory() {
    const cache = new Map<DOMElements, DreamyComponent<DOMElements>>();

    return new Proxy(styledFn, {
        apply(
            _,
            __,
            args: [
                DOMElements,
                RecipeDefinition<RecipeVariantRecord>,
                JsxFactoryOptions<JsxRecipeProps<DOMElements, RecipeSelection<RecipeVariantRecord>>>
            ]
        ) {
            return styledFn(...args);
        },
        get(_, el: DOMElements) {
            if (!el) {
                return undefined;
            }
            if (!cache.has(el)) {
                const comp = styledFn(el, undefined, undefined);
                cache.set(el, comp);
                return comp;
            }
            return cache.get(el)!;
        }
    }) as unknown as Dreamy;
}

export const dreamy = createJsxFactory();

export function getRef(child: React.ReactElement) {
    if ("ref" in (child?.props as object)) return (child.props as { ref: React.Ref<unknown> }).ref;
    if ("ref" in child) return child.ref;
    return null;
}

type PossibleRef<T> = React.Ref<T> | unknown | undefined;

export function setRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref !== null && ref !== undefined) {
        (ref as React.MutableRefObject<T>).current = value;
    }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
    return (node: T) => {
        for (const ref of refs) {
            setRef(ref, node);
        }
    };
}

interface HtmlProps {
    htmlSize?: number;
    htmlWidth?: string | number;
    htmlHeight?: string | number;
    htmlTranslate?: "yes" | "no" | undefined;
    htmlContent?: string;
}

export type HtmlProp =
    | "color"
    | "size"
    | "translate"
    | "transition"
    | "width"
    | "height"
    | "content";

export interface PolymorphicProps {
    as?: ElementType;
    asChild?: boolean;
    asComp?: React.ReactNode;
}

type PatchHtmlProps<T> = DistributiveOmit<T, HtmlProp> & HtmlProps;

type AssignHtmlProps<T extends Dict, P extends Dict = {}> = Assign<PatchHtmlProps<T>, P>;

type DataAttrProps = {
    [K in `data-${string}`]?: string;
};

type AriaAttrProps = {
    [K in `aria-${string}`]?: string;
};

export type HTMLDreamyProps<T extends ElementType, P extends Dict = {}> = AssignHtmlProps<
    ComponentPropsWithoutRef<T>,
    Assign<JsxStyleProps, P> & PolymorphicProps & UnstyledProps & DataAttrProps & AriaAttrProps
>;

export type AnyFunction<T = any> = (...args: T[]) => any;

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export interface FocusableElement {
    focus(options?: FocusOptions): void;
}

export type Dict<T = any> = Record<string, T>;

export type DOMElements = keyof React.JSX.IntrinsicElements;

export type HTMLDreamyComponents = {
    [Tag in DOMElements]: DreamyComponent<React.ComponentType<Tag>, {}>;
};

export type DreamyComponent<T extends ElementType, P extends Dict = {}> = FunctionComponent<
    HTMLDreamyProps<T, P> & { ref?: any }
>;

export type Status = "info" | "warning" | "error" | "success";
