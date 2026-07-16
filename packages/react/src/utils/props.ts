import type { Merge } from "./types";

interface DOMElement extends Element, HTMLOrSVGElement {}

interface DataAttributes {
	[dataAttr: string]: any;
}

export interface DOMAttributes<T = DOMElement>
	extends React.AriaAttributes,
		React.DOMAttributes<T>,
		DataAttributes {
	id?: string;
	role?: React.AriaRole;
	tabIndex?: number;
	style?: React.CSSProperties;
}

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
	props?: Merge<DOMAttributes, P>
) => R & React.RefAttributes<any>;

export type RequiredPropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
	props: Merge<DOMAttributes, P>
) => R & React.RefAttributes<any>;

export type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);

export function mergeProps<P extends Record<string, unknown>>(
	props: P,
	otherProps: Record<string, unknown>
) {
	return { ...props, ...otherProps };
}

export function omit<T extends Record<string, any>, K extends keyof T>(
	object: T,
	keysToOmit: K[] = []
) {
	const clone: Record<string, unknown> = Object.assign({}, object);
	for (const key of keysToOmit) {
		if (key in clone) {
			delete clone[key as string];
		}
	}
	return clone as Omit<T, K>;
}

/**
 * Dreamy proprietary props that must never be forwarded to native DOM elements.
 * Prefer native equivalents (`disabled`, `required`, `readOnly`, `checked`) and
 * `aria-*` / `data-*` attributes instead of these `is*` / callback helpers.
 */
export const DREAMY_PROPRIETARY_PROPS = [
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
] as const;

export type DreamyProprietaryProp = (typeof DREAMY_PROPRIETARY_PROPS)[number];

const dreamyProprietaryPropSet = new Set<string>(DREAMY_PROPRIETARY_PROPS);

/**
 * Returns whether a prop name is a Dreamy proprietary prop that should not hit the DOM.
 */
export function isDreamyProprietaryProp(prop: string): boolean {
	return dreamyProprietaryPropSet.has(prop);
}

/**
 * Strips known Dreamy proprietary props from a props object so the result is safe to spread onto DOM nodes.
 */
export function omitDreamyProps<T extends Record<string, any>>(props: T) {
	return omit(props, DREAMY_PROPRIETARY_PROPS as unknown as (keyof T)[]);
}

export function pick<T extends Record<string, any>, K extends keyof T>(object: T, keysToPick: K[]) {
	const result = {} as {
		[P in K]: T[P];
	};
	for (const key of keysToPick) {
		if (key in object) {
			result[key] = object[key];
		}
	}
	return result;
}

export function splitProps<T extends Record<string, any>, K extends Array<keyof T>>(
	props: T,
	keys: K
): [Pick<T, K[number]>, Omit<T, K[number]>] {
	const picked: Pick<T, K[number]> = {} as Pick<T, K[number]>;
	const rest: Omit<T, K[number]> = {} as Omit<T, K[number]>;

	const keySet = new Set(keys);

	for (const key in props) {
		if (keySet.has(key as K[number])) {
			picked[key as K[number]] = props[key];
		} else {
			(rest as any)[key] = props[key];
		}
	}

	return [picked, rest];
}

export function cx(...classes: (string | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
