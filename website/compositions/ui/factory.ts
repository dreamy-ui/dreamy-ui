import type React from "react";
import {
	Children,
	type ComponentPropsWithoutRef,
	type ElementType,
	type FunctionComponent,
	cloneElement,
	createElement,
	forwardRef,
	isValidElement,
	memo
} from "react";
import { styled } from "styled-system/jsx";
import type {
	Assign,
	DistributiveOmit,
	DistributiveUnion,
	JsxRecipeProps,
	JsxStyleProps,
	Pretty,
	RecipeDefinition,
	RecipeSelection,
	RecipeVariantRecord
} from "styled-system/types";

type DreamPropsWithRef<E extends React.ElementType> =
	React.ComponentPropsWithRef<E>;

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
							ref:
								"ref" in asComp
									? composeRefs(ref, asComp.ref)
									: ref
						},
						children
					);
				}

				if (!asChild) {
					return createElement(
						Component,
						{ ...restProps, ref },
						children
					);
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

export type JsxElement<
	T extends ElementType,
	P extends Dict
> = T extends DreamyComponent<infer A, infer B>
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

function styledWithAsProps<
	T extends ElementType,
	P extends RecipeVariantRecord
>(
	Component: T,
	recipe?: RecipeDefinition<P>,
	options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>
): DreamyComponent<T, {}>;
function styledWithAsProps<T extends ElementType, P extends RecipeFn>(
	Component: T,
	recipe?: P,
	options?: JsxFactoryOptions<JsxRecipeProps<T, P["__type"]>>
): DreamyComponent<T, P["__type"]> {
	return styled(withAsProps(Component), recipe as any, options) as any;
}

function createJsxFactory() {
	const cache = new Map<DOMElements, DreamyComponent<DOMElements>>();

	return new Proxy(styledWithAsProps, {
		apply(
			_,
			__,
			args: [
				DOMElements,
				RecipeDefinition<RecipeVariantRecord>,
				JsxFactoryOptions<
					JsxRecipeProps<
						DOMElements,
						RecipeSelection<RecipeVariantRecord>
					>
				>
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

export function getRef(child: React.ReactElement) {
	if ("ref" in (child?.props as object))
		return (child.props as { ref: React.Ref<unknown> }).ref;
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

type AssignHtmlProps<T extends Dict, P extends Dict = {}> = Assign<
	PatchHtmlProps<T>,
	P
>;

export type HTMLDreamyProps<
	T extends ElementType,
	P extends Dict = {}
> = AssignHtmlProps<
	ComponentPropsWithoutRef<T>,
	Assign<JsxStyleProps, P> & PolymorphicProps
>;

export type AnyFunction<T = any> = (...args: T[]) => any;

export type Merge<M, N> = N extends Record<string, unknown>
	? M
	: Omit<M, keyof N> & N;

export interface FocusableElement {
	focus(options?: FocusOptions): void;
}

export type Dict<T = any> = Record<string, T>;

export type DOMElements = keyof React.JSX.IntrinsicElements;

export type HTMLDreamyComponents = {
	[Tag in DOMElements]: DreamyComponent<React.ComponentType<Tag>, {}>;
};

export type DreamyComponent<
	T extends ElementType,
	P extends Dict = {}
> = FunctionComponent<HTMLDreamyProps<T, P> & { ref?: any }>;

export type Status = "info" | "warning" | "error" | "success";
