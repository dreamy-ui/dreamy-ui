export function callAll<T extends (...props: any) => any>(...fns: (T | undefined)[]) {
    return function mergedFn(...args: Parameters<T>) {
        for (const fn of fns) {
            fn?.(...args);
        }
    };
}

export function callAllHandlers<T extends (event: any) => void>(...fns: (T | undefined)[]) {
    return function func(event: Parameters<T>[0]) {
        fns.some((fn) => {
            fn?.(event);
            return event?.defaultPrevented;
        });
    };
}
