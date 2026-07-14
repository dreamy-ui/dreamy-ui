"use client";

import { useFocusOnShow } from "@/hooks/use-focus-effect";
import { useCallback, useRef } from "react";
import ReactFocusLock from "react-focus-lock";

const FocusTrap: typeof ReactFocusLock =
	(ReactFocusLock as any).default ?? ReactFocusLock;

interface FocusableElement {
	focus(options?: FocusOptions): void;
}
export interface FocusLockProps {
	/**
	 * `ref` of the element to receive focus initially
	 */
	initialFocusRef?: React.RefObject<FocusableElement | null>;
	/**
	 * `ref` of the element to return focus to when `FocusLock`
	 * unmounts
	 */
	finalFocusRef?: React.RefObject<FocusableElement | null>;
	/**
	 * The `ref` of the wrapper for which the focus-lock wraps
	 */
	contentRef?: React.RefObject<HTMLElement | null>;
	/**
	 * If `true`, focus will be restored to the element that
	 * triggered the `FocusLock` once it unmounts
	 *
	 * @default false
	 */
	restoreFocus?: boolean;
	/**
	 * The component to render
	 */
	children: React.ReactNode;
	/**
	 * If `true`, focus trapping will be disabled
	 *
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * If `true`, the first focusable element within the `children`
	 * will auto-focused once `FocusLock` mounts
	 *
	 * @default false
	 */
	autoFocus?: boolean;
	/**
	 * If `true`, disables text selections inside, and outside focus lock
	 *
	 * @default false
	 */
	persistentFocus?: boolean;
	/**
	 * Enables aggressive focus capturing within iframes.
	 * - If `true`: keep focus in the lock, no matter where lock is active
	 * - If `false`:  allows focus to move outside of iframe
	 *
	 * @default false
	 */
	lockFocusAcrossFrames?: boolean;
}

export const FocusLock: React.FC<FocusLockProps> = (props) => {
	const {
		initialFocusRef,
		finalFocusRef,
		contentRef,
		restoreFocus,
		children,
		isDisabled,
		autoFocus,
		persistentFocus,
		lockFocusAcrossFrames
	} = props;

	const fallbackRef = useRef<HTMLElement | null>(null);
	const containerRef = contentRef ?? fallbackRef;
	const shouldFocus = autoFocus || !!initialFocusRef;

	useFocusOnShow(containerRef, {
		focusRef: initialFocusRef,
		visible: !isDisabled,
		shouldFocus
	});

	const onDeactivation = useCallback(() => {
		finalFocusRef?.current?.focus();
	}, [finalFocusRef]);

	const returnFocus = restoreFocus && !finalFocusRef;

	return (
		<FocusTrap
			crossFrame={lockFocusAcrossFrames}
			persistentFocus={persistentFocus}
			autoFocus={false}
			disabled={isDisabled}
			onDeactivation={onDeactivation}
			returnFocus={returnFocus}
		>
			{children}
		</FocusTrap>
	);
};

FocusLock.displayName = "FocusLock";
