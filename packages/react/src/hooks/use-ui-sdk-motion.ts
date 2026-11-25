"use client";

import type * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export interface UiSdkMotionController {
    isOpen: boolean;
    reduceMotion: boolean;
    register: (key: string, el: HTMLElement | null) => void;
    notifyAnimationComplete: (key: string) => void;
    startExit: () => void;
    cancelExit: () => void;
    wrapOnOpenChange: <TDetails extends { canceled?: boolean }>(
        userHandler?: (open: boolean, details: TDetails) => void
    ) => (open: boolean, details: TDetails) => void;
}

export interface UseUiSdkMotionOptions {
    open?: boolean;
    defaultOpen?: boolean;
    reduceMotion: boolean;
    exitTimeoutMs?: number;
}

/**
 * Merges multiple React refs (object or callback, including React 19 cleanup refs)
 * into a single callback ref without dropping cleanup callbacks.
 */
export function mergeMotionRefs<T>(
    ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> {
    return (node: T | null) => {
        const entries = refs
            .filter((ref): ref is NonNullable<React.Ref<T>> => ref != null)
            .map((ref) => ({
                ref,
                cleanup:
                    typeof ref === "function"
                        ? ref(node)
                        : (((ref as React.MutableRefObject<T | null>).current = node), undefined)
            }));

        if (entries.some((entry) => typeof entry.cleanup === "function")) {
            return () => {
                for (const { ref, cleanup } of entries) {
                    if (typeof cleanup === "function") {
                        cleanup();
                    } else if (typeof ref === "function") {
                        ref(null);
                    } else {
                        (ref as React.MutableRefObject<T | null>).current = null;
                    }
                }
            };
        }

        return undefined;
    };
}

/**
 * Bridges Dreamy UI's Motion (`motion/react`) enter/exit animations with
 * `@ui-sdk/core` presence tracking (`animateOut` waits for WAAPI animations
 * present on the closing element synchronously when closing starts).
 */
export function useUiSdkMotion(options: UseUiSdkMotionOptions): UiSdkMotionController {
    const { open: openProp, defaultOpen = false, reduceMotion, exitTimeoutMs = 800 } = options;

    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
    const isOpen = isControlled ? openProp : internalOpen;

    const elementsRef = useRef(new Map<string, HTMLElement>());
    const gatesRef = useRef(new Map<string, Animation>());
    const isClosingRef = useRef(false);

    const cancelExit = useCallback(() => {
        isClosingRef.current = false;
        for (const gate of gatesRef.current.values()) {
            try {
                gate.cancel();
            } catch {
                // ignore already-finished animations
            }
        }
        gatesRef.current.clear();
    }, []);

    const startExit = useCallback(() => {
        isClosingRef.current = true;
        if (reduceMotion) {
            return;
        }
        for (const [key, el] of elementsRef.current.entries()) {
            if (!el.isConnected || el.hasAttribute("data-instant")) {
                continue;
            }
            const existing = gatesRef.current.get(key);
            if (existing) {
                try {
                    existing.cancel();
                } catch {
                    // ignore
                }
                gatesRef.current.delete(key);
            }
            if (typeof el.animate === "function") {
                const gate = el.animate([], { duration: exitTimeoutMs });
                gatesRef.current.set(key, gate);
            }
        }
    }, [exitTimeoutMs, reduceMotion]);

    const register = useCallback((key: string, el: HTMLElement | null) => {
        if (el) {
            elementsRef.current.set(key, el);
            return;
        }
        elementsRef.current.delete(key);
        const gate = gatesRef.current.get(key);
        if (gate) {
            try {
                gate.cancel();
            } catch {
                // ignore
            }
            gatesRef.current.delete(key);
        }
    }, []);

    const notifyAnimationComplete = useCallback((key: string) => {
        if (!isClosingRef.current) {
            return;
        }
        const gate = gatesRef.current.get(key);
        if (gate) {
            try {
                gate.finish();
            } catch {
                // ignore
            }
            gatesRef.current.delete(key);
        }
    }, []);

    const wrapOnOpenChange = useCallback(
        <TDetails extends { canceled?: boolean }>(
            userHandler?: (open: boolean, details: TDetails) => void
        ) => {
            return (nextOpen: boolean, details: TDetails) => {
                userHandler?.(nextOpen, details);
                if (details?.canceled) {
                    return;
                }
                if (nextOpen) {
                    cancelExit();
                    if (!isControlled) {
                        setInternalOpen(true);
                    }
                    return;
                }
                if (!isControlled) {
                    startExit();
                    setInternalOpen(false);
                }
            };
        },
        [cancelExit, isControlled, startExit]
    );

    useEffect(() => {
        return () => {
            cancelExit();
        };
    }, [cancelExit]);

    return useMemo(
        () => ({
            isOpen,
            reduceMotion,
            register,
            notifyAnimationComplete,
            startExit,
            cancelExit,
            wrapOnOpenChange
        }),
        [cancelExit, isOpen, notifyAnimationComplete, reduceMotion, register, startExit, wrapOnOpenChange]
    );
}

/**
 * Synchronizes controlled `open` transitions synchronously during layout commit,
 * running before parent `@ui-sdk/react` `useLayoutEffect` hands options to core.
 */
export function UiSdkMotionSync({
    controller,
    open
}: {
    controller: UiSdkMotionController;
    open?: boolean;
}) {
    const prevOpenRef = useRef(open);

    useLayoutEffect(() => {
        const prev = prevOpenRef.current;
        prevOpenRef.current = open;
        if (prev === true && open === false) {
            controller.startExit();
        } else if (prev === false && open === true) {
            controller.cancelExit();
        }
    }, [controller, open]);

    return null;
}
