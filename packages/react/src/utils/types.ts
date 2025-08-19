// export type HtmlProp =
// 	| "color"
// 	| "size"
// 	| "translate"
// 	| "transition"
// 	| "width"
// 	| "height"
// 	| "content";

import type { Target, TargetAndTransition, Transition } from "motion";

// export type AnyFunction<T = any> = (...args: T[]) => any;

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export type Status = "success" | "info" | "warning" | "error";

// export interface FocusableElement {
// 	focus(options?: FocusOptions): void;
// }

// export type Dict<T = any> = Record<string, T>;

// export type DOMElements = keyof React.JSX.IntrinsicElements;

type TargetResolver<P = {}> = (props: P & TransitionProperties) => TargetAndTransition;

type Variant<P = {}> = TargetAndTransition | TargetResolver<P>;

export type Variants<P = {}> = {
	enter: Variant<P>;
	exit: Variant<P>;
	initial?: Variant<P>;
};

type WithMotionState<P> = Partial<Record<"enter" | "exit", P>>;

export type TransitionConfig = WithMotionState<Transition>;

export type TransitionEndConfig = WithMotionState<Target>;

export type DelayConfig = WithMotionState<number>;

export type TransitionProperties = {
	/**
	 * Custom `transition` definition for `enter` and `exit`
	 */
	transition?: TransitionConfig;
	/**
	 * Custom `transitionEnd` definition for `enter` and `exit`
	 */
	transitionEnd?: TransitionEndConfig;
	/**
	 * Custom `delay` definition for `enter` and `exit`
	 */
	delay?: number | DelayConfig;
};

export type WithTransitionConfig<P extends object> = Omit<P, "transition"> &
	TransitionProperties & {
		/**
		 * If `true`, the element will unmount when `in={false}` and animation is done
		 */
		unmountOnExit?: boolean;
		/**
		 * Show the component; triggers when enter or exit states
		 */
		isOpen?: boolean;
	};
