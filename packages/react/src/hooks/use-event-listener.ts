"use client";

import { useEffect } from "react";
import { useCallbackRef } from "./use-callback-ref";

type Target = EventTarget | null | (() => EventTarget | null);
type Options =
    | boolean
    | (AddEventListenerOptions & {
          fireOnMount?: boolean;
      });

export function useEventListener<K extends keyof DocumentEventMap>(
    event: K,
    handler?: (event: DocumentEventMap[K]) => void,
    target?: Target,
    options?: Options
): VoidFunction;
export function useEventListener<K extends keyof DocumentEventMap>(
    event: K,
    handler?: (event: DocumentEventMap[K]) => void,
    target?: Target,
    options?: Options
): VoidFunction;
export function useEventListener<K extends keyof WindowEventMap>(
    event: K,
    handler?: (event: WindowEventMap[K]) => void,
    target?: Target,
    options?: Options
): VoidFunction;
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
    event: K,
    handler?: (event: GlobalEventHandlersEventMap[K]) => void,
    target?: Target,
    options?: Options
): VoidFunction;
export function useEventListener(
    event: string,
    handler: ((event: Event) => void) | undefined,
    target: Target = null,
    options?: Options
) {
    const listener = useCallbackRef(handler);

    useEffect(() => {
        const node = typeof target === "function" ? target() : target ?? document;

        if (!handler || !node) return;

        /**
         * Some folks would like to fire the event on mount, for example to set the scroll state.
         * This is unsafe, use only when not using `event` argument.
         */
        if (typeof options === "object" && options?.fireOnMount) {
            handler?.(new Event(event));
        }

        node.addEventListener(event, listener, options);
        return () => {
            node.removeEventListener(event, listener, options);
        };
    }, [event, target, options, listener, handler]);

    return () => {
        const node = typeof target === "function" ? target() : target ?? document;
        node?.removeEventListener(event, listener, options);
    };
}
