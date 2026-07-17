import { useEventListener } from "./use-event-listener";

export interface UseFocusOnMouseDownProps {
	/**
	 * If `true`, pointer-down focus polyfill is enabled (Safari).
	 *
	 * @default false
	 */
	enabled?: boolean;
	/**
	 * Ref to the element that should receive focus.
	 */
	ref: React.RefObject<HTMLElement | null>;
	/**
	 * Additional elements that should not steal focus when pressed.
	 */
	elements?: Array<React.RefObject<HTMLElement | null> | HTMLElement>;
}

function isRefObject(val: any): val is { current: any } {
	return "current" in val;
}

const isDom = () => typeof window !== "undefined";
function getPlatform() {
	const agent = (navigator as any).userAgentData;
	return agent?.platform ?? navigator.platform;
}
const vn = (v: RegExp) => isDom() && v.test(navigator.vendor);
const pt = (v: RegExp) => isDom() && v.test(getPlatform());
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isSafari = () => isApple() && vn(/apple/i);

/**
 * Polyfill to get `relatedTarget` working correctly consistently
 * across all browsers.
 *
 * It ensures that elements receives focus on pointer down if
 * it's not the active element.
 *
 * @internal
 */
export function useFocusOnPointerDown(props: UseFocusOnMouseDownProps) {
	const { ref, elements, enabled } = props;

	const doc = () => ref.current?.ownerDocument ?? document;

	useEventListener(
		"pointerdown",
		(event) => {
			if (!isSafari() || !enabled) return;
			const target = event.target as HTMLElement;

			const els = elements ?? [ref];
			const isValidTarget = els.some((elementOrRef) => {
				const el = isRefObject(elementOrRef)
					? elementOrRef.current
					: elementOrRef;
				return el?.contains(target) || el === target;
			});

			if (doc().activeElement !== target && isValidTarget) {
				event.preventDefault();
				target.focus();
			}
		},
		doc
	);
}
