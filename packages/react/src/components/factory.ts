import { composeRefs, getRef } from "@/utils/refs";
import type { DOMElements, DreamComponent, HTMLDreamComponents } from "@/utils/types";
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

type DreamPropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>;

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

                const onlyChild: React.ReactNode = Children.only(children);

                if (!isValidElement(onlyChild)) {
                    return null;
                }

                const childRef = getRef(onlyChild);

                return cloneElement(onlyChild, {
                    ...restProps,
                    ...onlyChild.props,
                    ref: ref ? composeRefs(ref, childRef) : childRef
                });
            }
        )
    );

    // @ts-expect-error - it exists
    Comp.displayName = Component.displayName || Component.name;

    return Comp;
}

type DreamFactory = <T extends ElementType, P extends object = {}>(
    component: T
) => DreamComponent<T, P>;

function factory() {
    const cache = new Map<DOMElements, DreamComponent<DOMElements>>();

    return new Proxy(withAsProps, {
        /**
         * @example
         * dream("div")
         */
        apply(_target, _thisArg, argArray: [DOMElements]) {
            return withAsProps(...argArray);
        },
        /**
         * @example
         * <dream.div />
         */
        get(_, ...element: [DOMElements]) {
            if (!cache.has(element[0])) {
                cache.set(element[0], withAsProps(...element));
            }
            return cache.get(element[0]);
        }
    }) as unknown as DreamFactory & HTMLDreamComponents;
}

export const dream = factory();
