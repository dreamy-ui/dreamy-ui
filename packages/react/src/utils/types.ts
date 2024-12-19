import type { Assign, DistributiveOmit, JsxStyleProps } from "@dreamy-ui/system/types";
import type React from "react";
import type { ComponentPropsWithoutRef, ElementType, FunctionComponent } from "react";

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

export type HTMLDreamProps<T extends ElementType, P extends Dict = {}> = AssignHtmlProps<
    ComponentPropsWithoutRef<T>,
    Assign<JsxStyleProps, P> & PolymorphicProps
>;

export type AnyFunction<T = any> = (...args: T[]) => any;

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export interface FocusableElement {
    focus(options?: FocusOptions): void;
}

export type Dict<T = any> = Record<string, T>;

export type DOMElements = keyof React.JSX.IntrinsicElements;

export type HTMLDreamComponents = {
    [Tag in DOMElements]: DreamComponent<React.ComponentType<Tag>, {}>;
};

export type DreamComponent<T extends ElementType, P extends Dict = {}> = FunctionComponent<
    HTMLDreamProps<T, P> & { ref?: any }
>;

export type Status = "info" | "warning" | "error" | "success";
