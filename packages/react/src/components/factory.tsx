import { composeRefs, getRef } from "@/utils/refs";
import type { DOMElements, Dict, DreamComponent } from "@/utils/types";
import type React from "react";
import {
    Children,
    type ElementType,
    cloneElement,
    createElement,
    forwardRef,
    isValidElement,
    memo
} from "react";
import { styled } from "styled-system/jsx";
import type {
    DistributiveUnion,
    JsxRecipeProps,
    Pretty,
    RecipeDefinition,
    RecipeSelection,
    RecipeVariantRecord
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

function withAsProps(Component: React.ElementType) {
    const Comp = memo(
        forwardRef<unknown, DreamPropsWithRef<typeof Component>>(
            (props: DreamPropsWithRef<typeof Component>, ref) => {
                const { asChild, asComp, children, ...restProps } = props;

                if (asComp) {
                    return createElement(
                        asComp.type,
                        {
                            ...restProps,
                            ...asComp.props,
                            ref: "ref" in asComp ? composeRefs(ref, asComp.ref) : ref
                        },
                        children
                    );
                }

                if (!asChild) {
                    return createElement(Component, { ...restProps, ref }, children);
                }

                const onlyChild = Children.only(children) as React.ReactElement;

                if (!isValidElement(onlyChild)) {
                    return null;
                }

                const childRef = getRef(onlyChild);

                return cloneElement(onlyChild, {
                    ...restProps,
                    ...(onlyChild.props as object),
                    ref: ref ? composeRefs(ref, childRef) : childRef
                });
            }
        )
    );

    // @ts-expect-error - it exists
    Comp.displayName = Component.displayName || Component.name;

    return Comp;
}

export type JsxElement<T extends ElementType, P extends Dict> = T extends DreamComponent<
    infer A,
    infer B
>
    ? DreamComponent<A, Pretty<DistributiveUnion<P, B>>>
    : DreamComponent<T, P>;

interface DreamFactory {
    <T extends ElementType>(component: T): DreamComponent<T, {}>;
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
    [K in keyof React.JSX.IntrinsicElements]: DreamComponent<K, {}>;
};

export type Dreamy = DreamFactory & JsxElements;

function styledWithAsProps<T extends ElementType, P extends RecipeVariantRecord>(
    Component: T,
    recipe?: RecipeDefinition<P>,
    options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>
): DreamComponent<T, {}>;
function styledWithAsProps<T extends ElementType, P extends RecipeFn>(
    Component: T,
    recipe?: P,
    options?: JsxFactoryOptions<JsxRecipeProps<T, P["__type"]>>
): DreamComponent<T, P["__type"]> {
    return styled(withAsProps(Component), recipe as any, options) as any;
}

function createJsxFactory() {
    const cache = new Map<DOMElements, DreamComponent<DOMElements>>();

    return new Proxy(styledWithAsProps, {
        apply(
            _,
            __,
            args: [
                DOMElements,
                RecipeDefinition<RecipeVariantRecord>,
                JsxFactoryOptions<JsxRecipeProps<DOMElements, RecipeSelection<RecipeVariantRecord>>>
            ]
        ) {
            return styledWithAsProps(...args);
        },
        get(_, el: DOMElements) {
            if (!cache.has(el)) {
                cache.set(el, styledWithAsProps(el, undefined, undefined));
            }
            return cache.get(el);
        }
    }) as unknown as Dreamy;
}

export const dreamy = createJsxFactory();
