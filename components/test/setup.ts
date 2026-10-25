import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
    cleanup();
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
    })
});

Element.prototype.scrollIntoView = function scrollIntoView() {};

class ResizeObserverMock {
    private callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }

    observe(target: Element) {
        const orientation = target.getAttribute("data-orientation");
        const width = target.clientWidth || (orientation === "vertical" ? 16 : 320);
        const height = target.clientHeight || (orientation === "vertical" ? 200 : 16);

        this.callback(
            [
                {
                    target,
                    contentRect: {
                        x: 0,
                        y: 0,
                        width,
                        height,
                        top: 0,
                        left: 0,
                        bottom: height,
                        right: width,
                        toJSON: () => ({})
                    } as DOMRectReadOnly,
                    borderBoxSize: [],
                    contentBoxSize: [],
                    devicePixelContentBoxSize: []
                } as ResizeObserverEntry
            ],
            this as ResizeObserver
        );
    }

    unobserve() {}
    disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    const rect = originalGetBoundingClientRect.call(this);
    const part = this.getAttribute("data-part");
    const scope = this.getAttribute("data-scope");

    if (
        scope === "slider" &&
        (part === "control" || part === "track") &&
        rect.width === 0 &&
        rect.height === 0
    ) {
        const orientation = this.getAttribute("data-orientation");
        const width = orientation === "vertical" ? 16 : 320;
        const height = orientation === "vertical" ? 200 : 16;

        return {
            x: 0,
            y: 0,
            width,
            height,
            top: 0,
            left: 0,
            right: width,
            bottom: height,
            toJSON: () => ({})
        } as DOMRect;
    }

    return rect;
};
