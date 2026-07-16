"use client";

import { useControllable, type useControllableProps } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { useCallback, useEffect, useRef } from "react";

function getToolbarButtons(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>("button")).filter(
        function isOperable(el) {
            return (
                !("disabled" in el && (el as HTMLButtonElement).disabled) &&
                el.getAttribute("aria-disabled") !== "true"
            );
        }
    );
}

function moveToolbarFocus(container: HTMLElement, key: string, active: Element | null) {
    const focusable = getToolbarButtons(container);
    if (focusable.length === 0) return null;

    const currentIndex = active instanceof HTMLElement ? focusable.indexOf(active) : -1;
    let nextIndex = currentIndex;

    if (key === "ArrowRight") {
        nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, focusable.length - 1);
    } else if (key === "ArrowLeft") {
        nextIndex = currentIndex < 0 ? focusable.length - 1 : Math.max(currentIndex - 1, 0);
    } else if (key === "Home") {
        nextIndex = 0;
    } else if (key === "End") {
        nextIndex = focusable.length - 1;
    } else {
        return null;
    }

    const next = focusable[nextIndex] ?? null;
    next?.focus();
    return next;
}

export interface UseActionBarProps extends useControllableProps {}

/**
 * Headless state and a11y helpers for ActionBar (toolbar semantics).
 */
export function useActionBar(props: UseActionBarProps = {}) {
    const disclosure = useControllable(props);
    const contentRef = useRef<HTMLElement | null>(null);
    const lastFocusedButtonRef = useRef<HTMLElement | null>(null);

    useEffect(
        function bindActionBarKeyboard() {
            if (!disclosure.isOpen) return;

            function resolveToolbar() {
                return (
                    contentRef.current ??
                    (document.querySelector('[role="toolbar"][aria-label="Action bar"]') as
                        | HTMLElement
                        | null)
                );
            }

            function handleFocusIn(event: FocusEvent) {
                const toolbar = resolveToolbar();
                if (!toolbar) return;
                const target = event.target;
                if (!(target instanceof HTMLElement) || !toolbar.contains(target)) return;
                const button = target.closest("button");
                if (button instanceof HTMLElement && toolbar.contains(button)) {
                    lastFocusedButtonRef.current = button;
                }
            }

            function handleKeyDown(event: KeyboardEvent) {
                if (event.key === "Escape") {
                    event.preventDefault();
                    disclosure.onClose();
                    return;
                }

                if (
                    event.key !== "ArrowRight" &&
                    event.key !== "ArrowLeft" &&
                    event.key !== "Home" &&
                    event.key !== "End"
                ) {
                    return;
                }

                const toolbar = resolveToolbar();
                if (!toolbar) return;

                const active =
                    (document.activeElement instanceof HTMLElement &&
                    toolbar.contains(document.activeElement)
                        ? document.activeElement
                        : null) ?? lastFocusedButtonRef.current;

                if (!active || !toolbar.contains(active)) return;

                event.preventDefault();
                const next = moveToolbarFocus(toolbar, event.key, active);
                if (next) {
                    lastFocusedButtonRef.current = next;
                }
            }

            document.addEventListener("focusin", handleFocusIn);
            document.addEventListener("keydown", handleKeyDown);
            return function cleanup() {
                document.removeEventListener("focusin", handleFocusIn);
                document.removeEventListener("keydown", handleKeyDown);
                lastFocusedButtonRef.current = null;
            };
        },
        [disclosure.isOpen, disclosure.onClose]
    );

    const getContentProps = useCallback(function getContentProps(props: Record<string, any> = {}) {
        const { ref, ...rest } = props;

        return {
            tabIndex: -1,
            ...rest,
            role: rest.role ?? "toolbar",
            "aria-label": rest["aria-label"] ?? "Action bar",
            ref: mergeRefs(contentRef, ref)
        };
    }, []);

    return {
        ...disclosure,
        getContentProps
    };
}

export type UseActionBarReturn = ReturnType<typeof useActionBar>;
