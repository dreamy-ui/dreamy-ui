import { Portal } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";

export default {
    title: "Portal"
} satisfies Meta;

export function NestedScopes() {
    return (
        <>
            <Portal zIndex="var(--z-index-dropdown)">
                <div data-testid="page-dropdown">Page dropdown</div>
            </Portal>

            <Portal zIndex="var(--z-index-modal)">
                <div data-testid="modal-scope">
                    Modal
                    <Portal zIndex="var(--z-index-dropdown)">
                        <div data-testid="nested-dropdown">Nested dropdown</div>
                    </Portal>
                </div>
            </Portal>
        </>
    );
}

export function EqualLayerOpenOrder() {
    const [activePortal, setActivePortal] = useState<"first" | "second">("first");

    function activateFirst() {
        setActivePortal("first");
    }

    function activateSecond() {
        setActivePortal("second");
    }

    return (
        <>
            <button
                data-testid="activate-first"
                onClick={activateFirst}
                type="button"
            >
                Activate first
            </button>
            <button
                data-testid="activate-second"
                onClick={activateSecond}
                type="button"
            >
                Activate second
            </button>

            <Portal
                isActive={activePortal === "first"}
                zIndex="var(--z-index-dropdown)"
            >
                <div data-testid="first-equal-layer">First portal</div>
            </Portal>
            <Portal
                isActive={activePortal === "second"}
                zIndex="var(--z-index-dropdown)"
            >
                <div data-testid="second-equal-layer">Second portal</div>
            </Portal>
        </>
    );
}

export function SiblingModalScopes() {
    return (
        <>
            <Portal zIndex="var(--z-index-modal)">
                <div data-testid="first-modal-scope">
                    First Modal
                    <Portal zIndex="var(--z-index-tooltip)">
                        <div data-testid="first-modal-tooltip">First Modal tooltip</div>
                    </Portal>
                </div>
            </Portal>
            <Portal zIndex="var(--z-index-modal)">
                <div data-testid="second-modal-scope">Second Modal</div>
            </Portal>
        </>
    );
}

export function HostCleanup() {
    const [isMounted, setIsMounted] = useState(true);

    function togglePortal() {
        setIsMounted(function toggle(current) {
            return !current;
        });
    }

    return (
        <>
            <button
                data-testid="toggle-portal"
                onClick={togglePortal}
                type="button"
            >
                Toggle portal
            </button>
            {isMounted && (
                <Portal zIndex="var(--z-index-popover)">
                    <div data-testid="cleanup-portal-content">Portal content</div>
                </Portal>
            )}
        </>
    );
}

interface PopoverApi {
    showPopover?: typeof HTMLElement.prototype.showPopover;
    hidePopover?: typeof HTMLElement.prototype.hidePopover;
}

export function FallbackHost() {
    const popoverApiRef = useRef<PopoverApi | null>(null);

    if (!popoverApiRef.current && typeof HTMLElement !== "undefined") {
        popoverApiRef.current = {
            showPopover: HTMLElement.prototype.showPopover,
            hidePopover: HTMLElement.prototype.hidePopover
        };
        Object.defineProperty(HTMLElement.prototype, "showPopover", {
            configurable: true,
            value: undefined
        });
        Object.defineProperty(HTMLElement.prototype, "hidePopover", {
            configurable: true,
            value: undefined
        });
    }

    useEffect(function restorePopoverApi() {
        const popoverApi = popoverApiRef.current;
        if (!popoverApi) return;

        Object.defineProperty(HTMLElement.prototype, "showPopover", {
            configurable: true,
            value: popoverApi.showPopover
        });
        Object.defineProperty(HTMLElement.prototype, "hidePopover", {
            configurable: true,
            value: popoverApi.hidePopover
        });
    }, []);

    return (
        <Portal zIndex="var(--z-index-popover)">
            <div data-testid="fallback-portal-content">Fallback portal</div>
        </Portal>
    );
}
