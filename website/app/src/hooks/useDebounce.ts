import { useEffect, useRef } from "react";

/**
 * Debounces a function call
 */
export default function useDebounce(
    action: () => void,
    dependencies: any[],
    delay = 500,
    initialFire = false
) {
    const initial = useRef(!initialFire);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (initial.current) {
            initial.current = false;
            return;
        }
        let timeoutId: any;

        function debounceFetch() {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                action();
            }, delay);
        }

        debounceFetch();

        return () => {
            clearTimeout(timeoutId);
        };
    }, dependencies);
}
