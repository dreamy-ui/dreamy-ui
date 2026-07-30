import { useSafeLayoutEffect } from "@/hooks";
import { useCallbackRef } from "@/hooks/use-callback-ref";
import { useCallback, useRef } from "react";
import { wrapIndex } from "./time-utils";

export interface UseInfiniteWheelProps {
    options: Array<number | string>;
    value: number | string | null | undefined;
    onChange: (value: number | string) => void;
    itemHeight: number;
    copies?: number;
    infinite?: boolean;
    isActive?: boolean;
}

export interface UseInfiniteWheelReturn {
    containerRef: React.RefObject<HTMLDivElement | null>;
    paddedCount: number;
    getOptionAtIndex: (index: number) => number | string;
    scrollToValue: (value: number | string, behavior?: ScrollBehavior) => boolean;
    getContainerProps: () => {
        ref: (node: HTMLDivElement | null) => void;
        onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
        onWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
    };
}

/**
 * Mobile-style infinite picker wheel.
 *
 * Intentionally avoids React state during drag/scroll so item lists stay mounted
 * and scrolling stays compositor-smooth. Selection commits only on user settle.
 * Programmatic sync (open / controlled value) never calls onChange.
 */
export function useInfiniteWheel(props: UseInfiniteWheelProps): UseInfiniteWheelReturn {
    const {
        options,
        value,
        onChange,
        itemHeight,
        copies = 5,
        infinite = true,
        isActive = true
    } = props;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const valueRef = useRef(value);
    const isActiveRef = useRef(isActive);
    const optionsRef = useRef(options);
    const itemHeightRef = useRef(itemHeight);
    const infiniteRef = useRef(infinite);

    const isAnimatingRef = useRef(false);
    const isDraggingRef = useRef(false);
    const dragMovedRef = useRef(false);
    const dragStartYRef = useRef(0);
    const dragStartScrollRef = useRef(0);
    const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const lastEmittedRef = useRef<number | string | null>(null);
    const pointerIdRef = useRef<number | null>(null);
    const suppressCommitRef = useRef(false);
    const suppressClearTokenRef = useRef(0);
    // false so the first active mount counts as an open, not an in-session edit.
    const wasActiveRef = useRef(false);
    const prevValueRef = useRef(value);

    valueRef.current = value;
    isActiveRef.current = isActive;
    optionsRef.current = options;
    itemHeightRef.current = itemHeight;
    infiniteRef.current = infinite;

    const onChangeRef = useCallbackRef(onChange);

    const optionsLength = options.length;
    const resolvedCopies = infinite ? Math.max(5, copies | 1) : 1;
    const middleCopy = Math.floor(resolvedCopies / 2);
    const paddedCount = Math.max(optionsLength * resolvedCopies, optionsLength);

    const clearSettleTimer = useCallback(function clearSettleTimer() {
        if (settleTimerRef.current) {
            clearTimeout(settleTimerRef.current);
            settleTimerRef.current = null;
        }
    }, []);

    const cancelAnimation = useCallback(function cancelAnimation() {
        if (animFrameRef.current != null) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        isAnimatingRef.current = false;
    }, []);

    const suppressCommits = useCallback(
        function suppressCommits(ms = 64) {
            suppressCommitRef.current = true;
            clearSettleTimer();
            const token = ++suppressClearTokenRef.current;
            window.setTimeout(function clearSuppress() {
                if (suppressClearTokenRef.current === token) {
                    suppressCommitRef.current = false;
                }
            }, ms);
        },
        [clearSettleTimer]
    );

    const getOptionAtIndex = useCallback(function getOptionAtIndex(index: number) {
        const list = optionsRef.current;
        if (list.length === 0) {
            return 0;
        }
        return list[wrapIndex(index, list.length)];
    }, []);

    const getIndexForValue = useCallback(function getIndexForValue(
        selected: number | string,
        copyIndex: number
    ) {
        const list = optionsRef.current;
        const localIndex = list.findIndex((option) => option === selected);
        const safeLocal = localIndex < 0 ? 0 : localIndex;
        return copyIndex * list.length + safeLocal;
    }, []);

    const readCenteredIndex = useCallback(function readCenteredIndex(node: HTMLDivElement) {
        const height = itemHeightRef.current;
        if (height <= 0) {
            return 0;
        }
        return Math.round(node.scrollTop / height);
    }, []);

    const normalizeInfinite = useCallback(
        function normalizeInfinite(node: HTMLDivElement, centeredIndex: number) {
            if (!infiniteRef.current) {
                return centeredIndex;
            }

            const length = optionsRef.current.length;
            if (length <= 0) {
                return centeredIndex;
            }

            const copyIndex = Math.floor(centeredIndex / length);
            if (copyIndex > 0 && copyIndex < resolvedCopies - 1) {
                return centeredIndex;
            }

            const valueAtCenter = getOptionAtIndex(centeredIndex);
            const middleIndex = getIndexForValue(valueAtCenter, middleCopy);
            suppressCommits();
            node.scrollTop = middleIndex * itemHeightRef.current;
            return middleIndex;
        },
        [getIndexForValue, getOptionAtIndex, middleCopy, resolvedCopies, suppressCommits]
    );

    const animateScrollTo = useCallback(
        function animateScrollTo(
            node: HTMLDivElement,
            top: number,
            duration: number,
            onComplete?: () => void
        ) {
            cancelAnimation();
            suppressCommits();

            const start = node.scrollTop;
            const delta = top - start;

            if (Math.abs(delta) < 0.5) {
                node.scrollTop = top;
                onComplete?.();
                return;
            }

            isAnimatingRef.current = true;
            const startTime = performance.now();

            function frame(now: number) {
                const t = Math.min(1, (now - startTime) / duration);
                const eased = 1 - (1 - t) ** 3;
                node.scrollTop = start + delta * eased;

                if (t < 1) {
                    animFrameRef.current = requestAnimationFrame(frame);
                    return;
                }

                animFrameRef.current = null;
                node.scrollTop = top;
                onComplete?.();
                isAnimatingRef.current = false;
                suppressCommits();
            }

            animFrameRef.current = requestAnimationFrame(frame);
        },
        [cancelAnimation, suppressCommits]
    );

    const durationForDistance = useCallback(function durationForDistance(distance: number) {
        const height = itemHeightRef.current || 36;
        const rows = Math.max(1, Math.abs(distance) / height);
        return Math.min(420, Math.max(200, 140 + rows * 32));
    }, []);

    const emitChange = useCallback(
        function emitChange(nextValue: number | string) {
            if (lastEmittedRef.current === nextValue) {
                return;
            }
            lastEmittedRef.current = nextValue;
            onChangeRef(nextValue);
        },
        [onChangeRef]
    );

    const commitCentered = useCallback(
        function commitCentered(node: HTMLDivElement) {
            if (suppressCommitRef.current || !isActiveRef.current) {
                return;
            }

            const height = itemHeightRef.current;
            if (height <= 0 || optionsRef.current.length === 0) {
                return;
            }

            let centeredIndex = readCenteredIndex(node);
            const snappedTop = centeredIndex * height;

            function finish() {
                if (suppressCommitRef.current || !isActiveRef.current) {
                    return;
                }
                centeredIndex = normalizeInfinite(node, readCenteredIndex(node));
                emitChange(getOptionAtIndex(centeredIndex));
            }

            if (Math.abs(node.scrollTop - snappedTop) > 0.5) {
                animateScrollTo(node, snappedTop, 180, finish);
                return;
            }

            finish();
        },
        [animateScrollTo, emitChange, getOptionAtIndex, normalizeInfinite, readCenteredIndex]
    );

    const scheduleCommit = useCallback(
        function scheduleCommit() {
            if (!isActiveRef.current || suppressCommitRef.current) {
                return;
            }
            clearSettleTimer();
            settleTimerRef.current = setTimeout(function onSettle() {
                const node = containerRef.current;
                if (
                    !node ||
                    !isActiveRef.current ||
                    suppressCommitRef.current ||
                    isDraggingRef.current ||
                    isAnimatingRef.current
                ) {
                    return;
                }
                commitCentered(node);
            }, 80);
        },
        [clearSettleTimer, commitCentered]
    );

    const scrollToValue = useCallback(
        function scrollToValue(next: number | string, behavior: ScrollBehavior = "auto") {
            const node = containerRef.current;
            const height = itemHeightRef.current;
            const length = optionsRef.current.length;
            if (!node || length === 0 || height <= 0) {
                return false;
            }

            const copyIndex = infiniteRef.current ? middleCopy : 0;
            const targetIndex = getIndexForValue(next, copyIndex);
            const top = targetIndex * height;

            // Positioning only - never treat this as a user commit.
            lastEmittedRef.current = next;

            if (behavior === "smooth") {
                animateScrollTo(node, top, durationForDistance(node.scrollTop - top), function onDone() {
                    normalizeInfinite(node, targetIndex);
                });
                return true;
            }

            cancelAnimation();
            // Keep commits blocked long enough for popover visibility / layout to settle.
            // Hidden popovers often discard scrollTop; retries re-apply until it sticks.
            suppressCommits(220);
            node.scrollTop = top;
            return Math.abs(node.scrollTop - top) < 1;
        },
        [
            animateScrollTo,
            cancelAnimation,
            durationForDistance,
            getIndexForValue,
            middleCopy,
            normalizeInfinite,
            suppressCommits
        ]
    );

    const syncToValue = useCallback(
        function syncToValue(behavior: ScrollBehavior = "auto", force = false) {
            if (!isActiveRef.current || isDraggingRef.current || isAnimatingRef.current) {
                return false;
            }

            const next = valueRef.current;
            if (next == null) {
                return false;
            }

            const node = containerRef.current;
            if (!node) {
                return false;
            }

            if (!force) {
                const centered = getOptionAtIndex(readCenteredIndex(node));
                if (centered === next) {
                    lastEmittedRef.current = next;
                    if (infiniteRef.current) {
                        normalizeInfinite(node, readCenteredIndex(node));
                    }
                    return true;
                }
            }

            return scrollToValue(next, behavior);
        },
        [getOptionAtIndex, normalizeInfinite, readCenteredIndex, scrollToValue]
    );

    const onScroll = useCallback(
        function onScroll() {
            if (
                !isActiveRef.current ||
                suppressCommitRef.current ||
                isAnimatingRef.current ||
                isDraggingRef.current
            ) {
                return;
            }
            scheduleCommit();
        },
        [scheduleCommit]
    );

    const indexFromClientY = useCallback(function indexFromClientY(node: HTMLDivElement, clientY: number) {
        const height = itemHeightRef.current;
        if (height <= 0) {
            return -1;
        }

        const rect = node.getBoundingClientRect();
        const spacer = 2 * height;
        const y = clientY - rect.top + node.scrollTop - spacer;
        return Math.floor(y / height);
    }, []);

    const animateToIndex = useCallback(
        function animateToIndex(node: HTMLDivElement, index: number) {
            const height = itemHeightRef.current;
            const length = optionsRef.current.length * (infiniteRef.current ? resolvedCopies : 1);

            if (index < 0 || index >= length || height <= 0) {
                return;
            }

            const top = index * height;

            animateScrollTo(node, top, durationForDistance(node.scrollTop - top), function onDone() {
                const normalized = normalizeInfinite(node, index);
                emitChange(getOptionAtIndex(normalized));
            });
        },
        [
            animateScrollTo,
            durationForDistance,
            emitChange,
            getOptionAtIndex,
            normalizeInfinite,
            resolvedCopies
        ]
    );

    const onPointerMove = useCallback(function onPointerMove(event: PointerEvent) {
        if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId) {
            return;
        }

        const node = containerRef.current;
        if (!node) {
            return;
        }

        const delta = event.clientY - dragStartYRef.current;
        if (Math.abs(delta) > 3) {
            dragMovedRef.current = true;
        }

        node.scrollTop = dragStartScrollRef.current - delta;
        event.preventDefault();
    }, []);

    const onPointerUp = useCallback(
        function onPointerUp(event: PointerEvent) {
            if (pointerIdRef.current !== event.pointerId) {
                return;
            }

            const node = containerRef.current;
            const wasDragging = dragMovedRef.current;
            const clientY = event.clientY;

            isDraggingRef.current = false;
            pointerIdRef.current = null;
            dragMovedRef.current = false;

            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);

            if (node) {
                try {
                    node.releasePointerCapture(event.pointerId);
                } catch {
                    // ignore
                }

                if (wasDragging) {
                    commitCentered(node);
                } else {
                    animateToIndex(node, indexFromClientY(node, clientY));
                }
            }
        },
        [animateToIndex, commitCentered, indexFromClientY, onPointerMove]
    );

    const onPointerDown = useCallback(
        function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
            if (event.button !== 0) {
                return;
            }

            const node = containerRef.current;
            if (!node) {
                return;
            }

            clearSettleTimer();
            cancelAnimation();
            suppressCommitRef.current = false;

            isDraggingRef.current = true;
            dragMovedRef.current = false;
            dragStartYRef.current = event.clientY;
            dragStartScrollRef.current = node.scrollTop;
            pointerIdRef.current = event.pointerId;

            node.setPointerCapture(event.pointerId);
            window.addEventListener("pointermove", onPointerMove, { passive: false });
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);
        },
        [cancelAnimation, clearSettleTimer, onPointerMove, onPointerUp]
    );

    const onWheel = useCallback(
        function onWheel(event: React.WheelEvent<HTMLDivElement>) {
            const node = containerRef.current;
            if (!node) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            cancelAnimation();
            suppressCommitRef.current = false;
            node.scrollTop += event.deltaY;
            scheduleCommit();
        },
        [cancelAnimation, scheduleCommit]
    );

    const bindRef = useCallback(
        function bindRef(node: HTMLDivElement | null) {
            const previous = containerRef.current;
            if (previous) {
                previous.removeEventListener("scroll", onScroll);
            }

            containerRef.current = node;

            if (!node) {
                return;
            }

            node.addEventListener("scroll", onScroll, { passive: true });
        },
        [onScroll]
    );

    // Open / close only. Kept separate so value updates cannot cancel open retries
    // (and React Strict Mode remounts still re-run a full force sync).
    useSafeLayoutEffect(
        function syncOnOpenClose() {
            if (!isActive) {
                wasActiveRef.current = false;
                isDraggingRef.current = false;
                cancelAnimation();
                clearSettleTimer();
                suppressCommitRef.current = true;
                return;
            }

            wasActiveRef.current = true;

            function retry() {
                if (!isActiveRef.current) {
                    return;
                }
                cancelAnimation();
                suppressCommits(250);
                syncToValue("auto", true);
            }

            retry();

            const timers: number[] = [];
            const frames: number[] = [];
            let resizeObserver: ResizeObserver | null = null;

            frames.push(
                requestAnimationFrame(function onFrame1() {
                    retry();
                    frames.push(
                        requestAnimationFrame(function onFrame2() {
                            retry();
                        })
                    );
                })
            );
            timers.push(window.setTimeout(retry, 0));
            timers.push(window.setTimeout(retry, 50));
            timers.push(window.setTimeout(retry, 120));
            timers.push(window.setTimeout(retry, 200));

            const node = containerRef.current;
            if (node && typeof ResizeObserver !== "undefined") {
                resizeObserver = new ResizeObserver(function onResize() {
                    if (node.clientHeight > 0) {
                        retry();
                    }
                });
                resizeObserver.observe(node);
            }

            return function cleanup() {
                for (const frame of frames) {
                    cancelAnimationFrame(frame);
                }
                for (const timer of timers) {
                    window.clearTimeout(timer);
                }
                resizeObserver?.disconnect();
                // Strict Mode runs cleanup then re-runs while still active.
                // Reset so the remount performs a full open sync again.
                if (isActiveRef.current) {
                    wasActiveRef.current = false;
                }
            };
        },
        [cancelAnimation, clearSettleTimer, isActive, suppressCommits, syncToValue]
    );

    // Controlled value edits while the popover stays open.
    useSafeLayoutEffect(
        function syncOnValueChange() {
            const valueChanged = prevValueRef.current !== value;
            prevValueRef.current = value;

            if (!isActive || !valueChanged) {
                return;
            }

            syncToValue("smooth");
        },
        [isActive, itemHeight, optionsLength, syncToValue, value]
    );

    useSafeLayoutEffect(function cleanupGlobal() {
        return function onUnmount() {
            clearSettleTimer();
            cancelAnimation();
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);

            const node = containerRef.current;
            if (node) {
                node.removeEventListener("scroll", onScroll);
            }
        };
    }, [cancelAnimation, clearSettleTimer, onPointerMove, onPointerUp, onScroll]);

    const getContainerProps = useCallback(
        function getContainerProps() {
            return {
                ref: bindRef,
                onPointerDown,
                onWheel
            };
        },
        [bindRef, onPointerDown, onWheel]
    );

    return {
        containerRef,
        paddedCount,
        getOptionAtIndex,
        scrollToValue,
        getContainerProps
    };
}
