"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * React effect hook that invokes only on update.
 * It doesn't invoke on mount
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
    const renderCycleRef = useRef(false);
    const effectCycleRef = useRef(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const isMounted = renderCycleRef.current;
        const shouldRun = isMounted && effectCycleRef.current;
        if (shouldRun) {
            return effect();
        }
        effectCycleRef.current = true;
    }, deps);

    useEffect(() => {
        renderCycleRef.current = true;
        return () => {
            renderCycleRef.current = false;
        };
    }, []);
};

/**
 * React effect hook that invokes only on update.
 * It doesn't invoke on mount
 */
export const useUpdateLayoutEffect: typeof useEffect = (effect, deps) => {
    const renderCycleRef = useRef(false);
    const effectCycleRef = useRef(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useLayoutEffect(() => {
        const isMounted = renderCycleRef.current;
        const shouldRun = isMounted && effectCycleRef.current;
        if (shouldRun) {
            return effect();
        }
        effectCycleRef.current = true;
    }, deps);

    useEffect(() => {
        renderCycleRef.current = true;
        return () => {
            renderCycleRef.current = false;
        };
    }, []);
};
