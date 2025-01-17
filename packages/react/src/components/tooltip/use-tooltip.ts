import { type UsePopperProps, popperCSSVars, usePopper } from "@/components/popper";
import { useControllable, useEventListener } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { type PropGetter, callAllHandlers } from "@/utils";
import { getScrollParent } from "@/utils/scrollable";
import type React from "react";
import { type RefObject, useCallback, useEffect, useId, useRef } from "react";

export interface UseTooltipProps
    extends Pick<
        UsePopperProps,
        "modifiers" | "gutter" | "offset" | "arrowPadding" | "direction" | "placement"
    > {
    /**
     * Delay (in ms) before showing the tooltip
     * @default 0ms
     */
    openDelay?: number;
    /**
     * Delay (in ms) before hiding the tooltip
     * @default 0ms
     */
    closeDelay?: number;
    /**
     * If `true`, the tooltip will hide on click
     * @default true
     */
    closeOnClick?: boolean;
    /**
     * If `true`, the tooltip will hide while the pointer is down
     * @default true
     */
    closeOnPointerDown?: boolean;
    /**
     * If `true`, the tooltip will hide on pressing Esc key
     * @default true
     */
    closeOnEsc?: boolean;
    /**
     * Callback to run when the tooltip shows
     */
    onOpen?(): void;
    /**
     * Callback to run when the tooltip hides
     */
    onClose?(): void;
    /**
     * Custom `id` to use in place of `uuid`
     */
    id?: string;
    /**
     * If `true`, the tooltip will be shown (in controlled mode)
     * @default false
     */
    isOpen?: boolean;
    /**
     * If `true`, the tooltip will be initially shown
     * @default false
     */
    defaultIsOpen?: boolean;
    /**
     * @default false
     */
    isDisabled?: boolean;
    /**
     * @default false
     */
    closeOnScroll?: boolean;
    /**
     * @default 10
     */
    arrowSize?: number;
    arrowShadowColor?: string;
}

const getDoc = (ref: React.RefObject<Element | null>) => ref.current?.ownerDocument || document;

const getWin = (ref: React.RefObject<Element | null>) =>
    ref.current?.ownerDocument?.defaultView || window;

export function useTooltip(props: Partial<UseTooltipProps> = {}) {
    const {
        openDelay = 0,
        closeDelay = 0,
        closeOnClick = true,
        closeOnScroll,
        closeOnPointerDown,
        closeOnEsc = true,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        placement,
        id,
        isOpen: isOpenProp,
        defaultIsOpen,
        arrowSize = 10,
        arrowShadowColor,
        arrowPadding,
        modifiers,
        isDisabled,
        gutter,
        offset,
        direction
    } = props;

    const { isOpen, onOpen, onClose } = useControllable({
        isOpen: isOpenProp,
        defaultIsOpen,
        onOpen: onOpenProp,
        onClose: onCloseProp
    });

    const { referenceRef, getPopperProps, getArrowInnerProps, getArrowProps } = usePopper({
        enabled: isOpen,
        placement,
        arrowPadding,
        modifiers,
        gutter,
        offset,
        direction
    });

    const uuid = useId();
    const uid = id ?? uuid;
    const tooltipId = `tooltip-${uid}`;

    const ref = useRef<HTMLElement>(null);

    const enterTimeout = useRef<number>(null);
    const clearEnterTimeout = useCallback(() => {
        if (enterTimeout.current) {
            clearTimeout(enterTimeout.current);
            enterTimeout.current = null;
        }
    }, []);

    const exitTimeout = useRef<number>(null);
    const clearExitTimeout = useCallback(() => {
        if (exitTimeout.current) {
            clearTimeout(exitTimeout.current);
            exitTimeout.current = null;
        }
    }, []);

    const closeNow = useCallback(() => {
        clearExitTimeout();
        onClose();
    }, [onClose, clearExitTimeout]);

    const dispatchCloseEvent = useCloseEvent(ref, closeNow);

    const openWithDelay = useCallback(() => {
        if (!isDisabled && !enterTimeout.current) {
            if (isOpen) dispatchCloseEvent();
            const win = getWin(ref);
            enterTimeout.current = win.setTimeout(onOpen, openDelay);
        }
    }, [dispatchCloseEvent, isDisabled, isOpen, onOpen, openDelay]);

    const closeWithDelay = useCallback(() => {
        clearEnterTimeout();
        const win = getWin(ref);
        exitTimeout.current = win.setTimeout(closeNow, closeDelay);
    }, [closeDelay, closeNow, clearEnterTimeout]);

    const onClick = useCallback(() => {
        if (isOpen && closeOnClick) {
            closeWithDelay();
        }
    }, [closeOnClick, closeWithDelay, isOpen]);

    const onPointerDown = useCallback(() => {
        if (isOpen && closeOnPointerDown) {
            closeWithDelay();
        }
    }, [closeOnPointerDown, closeWithDelay, isOpen]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (isOpen && event.key === "Escape") {
                closeWithDelay();
            }
        },
        [isOpen, closeWithDelay]
    );

    useEventListener("keydown", closeOnEsc ? onKeyDown : undefined, () => getDoc(ref));

    useEventListener(
        "scroll",
        () => {
            if (isOpen && closeOnScroll) {
                closeNow();
            }
        },
        () => {
            if (!closeOnScroll) return null;
            const node = ref.current;
            if (!node) return null;
            const scrollParent = getScrollParent(node);
            return scrollParent.localName === "body" ? getWin(ref) : scrollParent;
        },
        { passive: true, capture: true }
    );

    useEffect(() => {
        if (!isDisabled) return;
        clearEnterTimeout();
        if (isOpen) onClose();
    }, [isDisabled, isOpen, onClose, clearEnterTimeout]);

    useEffect(() => {
        return () => {
            clearEnterTimeout();
            clearExitTimeout();
        };
    }, [clearEnterTimeout, clearExitTimeout]);

    /**
     * This allows for catching pointerleave events when the tooltip
     * trigger is disabled. There's currently a known issue in
     * React regarding the onPointerLeave polyfill.
     * @see https://github.com/facebook/react/issues/11972
     */
    useEventListener("pointerleave", closeWithDelay, () => ref.current);

    const getTriggerProps: PropGetter = useCallback(
        (props = {}, _ref = null) => {
            const triggerProps = {
                ...props,
                ref: mergeRefs(ref, _ref, referenceRef),
                onPointerEnter: callAllHandlers(props.onPointerEnter, (e) => {
                    if (e.pointerType === "touch") return;
                    openWithDelay();
                }),
                onClick: callAllHandlers(props.onClick, onClick),
                onPointerDown: callAllHandlers(props.onPointerDown, onPointerDown),
                onFocus: callAllHandlers(props.onFocus, openWithDelay),
                onBlur: callAllHandlers(props.onBlur, closeWithDelay),
                "aria-describedby": isOpen ? tooltipId : undefined
            };

            return triggerProps;
        },
        [openWithDelay, closeWithDelay, onPointerDown, isOpen, tooltipId, onClick, referenceRef]
    );

    const getTooltipPositionerProps: PropGetter = useCallback(
        (props = {}, forwardedRef = null) => {
            return getPopperProps(
                {
                    ...props,
                    style: {
                        ...props.style,
                        pointerEvents: "none",
                        [popperCSSVars.arrowSize.var]: arrowSize ? `${arrowSize}px` : undefined,
                        [popperCSSVars.arrowShadowColor.var]: arrowShadowColor
                    }
                },
                forwardedRef
            );
        },
        [getPopperProps, arrowSize, arrowShadowColor]
    );

    const getTooltipProps: PropGetter = useCallback(
        (props = {}, ref = null) => {
            const styles: React.CSSProperties = {
                ...props.style,
                position: "relative",
                transformOrigin: popperCSSVars.transformOrigin.varRef
            };

            return {
                ref,
                ...props,
                id: tooltipId,
                role: "tooltip",
                style: styles
            };
        },
        [tooltipId]
    );

    return {
        isOpen,
        show: openWithDelay,
        hide: closeWithDelay,
        getTriggerProps,
        getTooltipProps,
        getTooltipPositionerProps,
        getArrowProps,
        getArrowInnerProps
    };
}

export type UseTooltipReturn = ReturnType<typeof useTooltip>;

const closeEventName = "dreamy-ui:close-tooltip";

function useCloseEvent(ref: RefObject<Element | null>, close: () => void) {
    useEffect(() => {
        const doc = getDoc(ref);
        doc.addEventListener(closeEventName, close);
        return () => doc.removeEventListener(closeEventName, close);
    }, [close, ref]);

    return () => {
        const doc = getDoc(ref);
        const win = getWin(ref);
        doc.dispatchEvent(new win.CustomEvent(closeEventName));
    };
}
