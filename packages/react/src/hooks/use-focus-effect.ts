import { useSafeLayoutEffect } from "@/components/descendant/utils";
import { getAllFocusable } from "@/utils/focusable";
import { getActiveElement } from "@/utils/owner";
import { isTabbable } from "@/utils/tabbable";
import type { FocusableElement } from "@/utils/types";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";
import { useEventListener } from "./use-event-listener";
import { useUpdateEffect } from "./use-update-effect";

export interface UseFocusOnHideOptions {
    focusRef: RefObject<FocusableElement | null>;
    shouldFocus?: boolean;
    visible?: boolean;
}

function preventReturnFocus(containerRef: React.RefObject<HTMLElement | null>) {
    const el = containerRef.current;
    if (!el) return false;

    const activeElement = getActiveElement(el);
    if (!activeElement) return false;

    if (el.contains(activeElement)) return false;
    if (isTabbable(activeElement)) return true;

    return false;
}

/**
 * Popover hook to manage the focus when the popover closes or hides.
 *
 * We either want to return focus back to the popover trigger or
 * let focus proceed normally if user moved to another interactive
 * element in the viewport.
 */
export function useFocusOnHide(
    containerRef: RefObject<HTMLElement | null>,
    options: UseFocusOnHideOptions
) {
    const { shouldFocus: shouldFocusProp, visible, focusRef } = options;

    const shouldFocus = shouldFocusProp && !visible;

    useUpdateEffect(() => {
        if (!shouldFocus) return;

        if (preventReturnFocus(containerRef)) {
            return;
        }

        const el = focusRef?.current || containerRef.current;

        let rafId: number;

        if (el) {
            rafId = requestAnimationFrame(() => {
                el.focus({ preventScroll: true });
            });
            return () => {
                cancelAnimationFrame(rafId);
            };
        }
    }, [shouldFocus, containerRef, focusRef]);
}

export interface UseFocusOnShowOptions {
    visible?: boolean;
    shouldFocus?: boolean;
    preventScroll?: boolean;
    focusRef?: React.RefObject<FocusableElement | null>;
}

const defaultOptions: UseFocusOnShowOptions = {
    preventScroll: true,
    shouldFocus: false
};

export function useFocusOnShow<T extends HTMLElement>(
    target: React.RefObject<T | null> | T | null,
    options = defaultOptions
) {
    const { focusRef, preventScroll, shouldFocus, visible } = options;
    const element = isRefObject(target) ? target.current : target;

    const autoFocusValue = shouldFocus && visible;
    const autoFocusRef = useRef(autoFocusValue);
    const lastVisibleRef = useRef(visible);

    useSafeLayoutEffect(() => {
        if (!lastVisibleRef.current && visible) {
            autoFocusRef.current = autoFocusValue;
        }
        lastVisibleRef.current = visible;
    }, [visible, autoFocusValue]);

    const onFocus = useCallback(() => {
        if (!visible || !element || !autoFocusRef.current) return;
        autoFocusRef.current = false;

        if (element.contains(document.activeElement as HTMLElement)) return;

        if (focusRef?.current) {
            requestAnimationFrame(() => {
                focusRef.current?.focus({ preventScroll });
            });
        } else {
            const tabbableEls = getAllFocusable(element);
            if (tabbableEls.length > 0) {
                requestAnimationFrame(() => {
                    tabbableEls[0].focus({ preventScroll });
                });
            }
        }
    }, [visible, preventScroll, element, focusRef]);

    useUpdateEffect(() => {
        onFocus();
    }, [onFocus]);

    useEventListener("transitionend", onFocus, element);
}

function isRefObject(val: any): val is { current: any } {
    return "current" in val;
}
