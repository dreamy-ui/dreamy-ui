import { type Ref, type RefObject, useImperativeHandle, useRef } from "react";

export function useDOMRef<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T | null> | Ref<T | null>
) {
    const domRef = useRef<T>(null);

    useImperativeHandle(ref, () => domRef.current);

    return domRef;
}
