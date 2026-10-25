"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseHoverOpenOptions {
    enabled: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    openDelay: number;
    closeDelay: number;
    onOpenChange?: (details: { open: boolean }) => void;
}

export function useHoverOpen(options: UseHoverOpenOptions) {
    const { enabled, open: openProp, defaultOpen, openDelay, closeDelay, onOpenChange } = options;

    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const open = isControlled ? openProp : uncontrolledOpen;

    const isHoveringRef = useRef(false);
    const openTimeout = useRef<number | null>(null);
    const closeTimeout = useRef<number | null>(null);

    const setOpen = useCallback(
        (next: boolean) => {
            if (!enabled) return;
            if (!isControlled) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.({ open: next });
        },
        [enabled, isControlled, onOpenChange]
    );

    const clearTimers = useCallback(() => {
        if (openTimeout.current !== null) {
            window.clearTimeout(openTimeout.current);
            openTimeout.current = null;
        }
        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const scheduleOpen = useCallback(() => {
        if (!enabled) return;
        isHoveringRef.current = true;
        openTimeout.current = window.setTimeout(() => {
            setOpen(true);
        }, openDelay);
    }, [enabled, openDelay, setOpen]);

    const scheduleClose = useCallback(() => {
        if (!enabled) return;
        isHoveringRef.current = false;
        if (openTimeout.current !== null) {
            window.clearTimeout(openTimeout.current);
            openTimeout.current = null;
        }
        closeTimeout.current = window.setTimeout(() => {
            if (isHoveringRef.current === false) {
                setOpen(false);
            }
        }, closeDelay);
    }, [closeDelay, enabled, setOpen]);

    const triggerHoverProps = enabled
        ? {
              onPointerEnter: scheduleOpen,
              onPointerLeave: scheduleClose,
              onFocus: () => {
                  if (openTimeout.current === null) {
                      setOpen(true);
                  }
              },
              onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                  if (event.key === "Escape") {
                      setOpen(false);
                  }
              }
          }
        : undefined;

    const contentHoverProps = enabled
        ? {
              onPointerEnter: () => {
                  isHoveringRef.current = true;
              },
              onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
                  if (event.nativeEvent.relatedTarget === null) {
                      return;
                  }
                  scheduleClose();
              }
          }
        : undefined;

    return {
        open: enabled ? open : undefined,
        setOpen,
        triggerHoverProps,
        contentHoverProps
    };
}
