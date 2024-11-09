import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

export default function dynamic<T extends ComponentType<any>>(
    cb: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
    if (typeof window !== "undefined") {
        return lazy(cb);
    }
        return (() => ({ default: null })) as unknown as LazyExoticComponent<T>;
}