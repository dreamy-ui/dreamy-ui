/* eslint-disable */
import type { ElementType, ReactNode, JSX, ComponentPropsWithRef, ComponentType, Component } from 'react'
import type { RecipeDefinition, RecipeSelection, RecipeVariantRecord } from './recipe';
import type { Assign, DistributiveOmit, DistributiveUnion, JsxHTMLProps, JsxStyleProps, Pretty } from './system-types';

interface Dict {
  [k: string]: unknown
}

export type DataAttrs = Record<`data-${string}`, unknown>

export interface UnstyledProps {
  /**
   * Whether to remove recipe styles
   */
  unstyled?: boolean | undefined
}

export interface AsProps {
  /**
   * The element to render as
   */
  as?: ElementType | ReactNode | undefined
  /**
   * If `true`, the component will render the child as a component.
   * @default false
   */
  asChild?: boolean;
}

export type ComponentProps<T extends ElementType> = T extends ComponentType<infer P> | Component<infer P>
  ? JSX.LibraryManagedAttributes<T, P>
  : ComponentPropsWithRef<T>

export interface DreamyComponent<T extends ElementType, P extends Dict = {}> {
  (props: JsxHTMLProps<ComponentProps<T> & UnstyledProps & AsProps, Assign<JsxStyleProps, P>>): JSX.Element
  displayName?: string | undefined
}

interface RecipeFn {
  __type: any
}

export interface JsxFactoryOptions<TProps extends Dict> {
  dataAttr?: boolean
  defaultProps?: Partial<TProps> & DataAttrs
  shouldForwardProp?: (prop: string, variantKeys: string[]) => boolean
  forwardProps?: string[]
}

export type JsxRecipeProps<T extends ElementType, P extends Dict> = JsxHTMLProps<ComponentProps<T> & UnstyledProps & AsProps, P>;

export type JsxElement<T extends ElementType, P extends Dict> = T extends DreamyComponent<infer A, infer B>
  ? DreamyComponent<A, Pretty<DistributiveUnion<P, B>>>
  : DreamyComponent<T, P>

export interface JsxFactory {
  <T extends ElementType>(component: T): DreamyComponent<T, {}>
  <T extends ElementType, P extends RecipeVariantRecord>(component: T, recipe: RecipeDefinition<P>, options?: JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>): JsxElement<
    T,
    RecipeSelection<P>
  >
  <T extends ElementType, P extends RecipeFn>(component: T, recipeFn: P, options?: JsxFactoryOptions<JsxRecipeProps<T, P['__type']>>): JsxElement<T, P['__type']>
}

export type JsxElements = {
  [K in keyof JSX.IntrinsicElements]: DreamyComponent<K, {}>
}

export type Dreamy = JsxFactory & JsxElements

export type HTMLDreamyProps<T extends ElementType> = JsxHTMLProps<ComponentProps<T> & UnstyledProps & AsProps, JsxStyleProps>

export type DreamyVariantProps<T extends DreamyComponent<any, any>> = T extends DreamyComponent<any, infer Props> ? Props : never