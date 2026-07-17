"use client";

import type React from "react";
import { useCallback, useId, useState } from "react";
import { useCallbackRef } from "./use-callback-ref";

export interface useControllableProps {
    /**
     * If `true`, the disclosure is open (controlled).
     */
    isOpen?: boolean;
    /**
     * If `true`, the disclosure is open on initial render (uncontrolled).
     *
     * @default false
     */
    defaultIsOpen?: boolean;
    /**
     * Callback fired when the disclosure closes.
     */
    onClose?(): void;
    /**
     * Callback fired when the disclosure opens.
     */
    onOpen?(): void;
    /**
     * Custom id used for `aria-controls` / disclosure wiring.
     * Falls back to an auto-generated id when omitted.
     */
    id?: string;
}

type HTMLProps = React.HTMLAttributes<HTMLElement>;

/**
 * `useControllable` is a custom hook used to help handle common open, close, or toggle scenarios.
 * It can be used to control feedback component such as `Modal`, `AlertDialog`, `Drawer`, etc.
 *
 */
export function useControllable(props: useControllableProps = {}) {
    const { onClose: onCloseProp, onOpen: onOpenProp, isOpen: isOpenProp, id: idProp } = props;

    const handleOpen = useCallbackRef(onOpenProp);
    const handleClose = useCallbackRef(onCloseProp);

    const [isOpenState, setIsOpen] = useState(props.defaultIsOpen || false);

    const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;

    const isControlled = isOpenProp !== undefined;

    const uid = useId();
    const id = idProp ?? `disclosure-${uid}`;

    const onClose = useCallback(() => {
        if (!isControlled) {
            setIsOpen(false);
        }
        handleClose?.();
    }, [isControlled, handleClose]);

    const onOpen = useCallback(() => {
        if (!isControlled) {
            setIsOpen(true);
        }
        handleOpen?.();
    }, [isControlled, handleOpen]);

    const onToggle = useCallback(() => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    }, [isOpen, onOpen, onClose]);

    function getButtonProps(props: HTMLProps = {}): HTMLProps {
        return {
            ...props,
            "aria-expanded": isOpen,
            "aria-controls": id,
            onClick(event) {
                props.onClick?.(event);
                onToggle();
            }
        };
    }

    function getDisclosureProps(props: HTMLProps = {}): HTMLProps {
        return {
            ...props,
            hidden: !isOpen,
            id
        };
    }

    return {
        isOpen,
        onOpen,
        onClose,
        onToggle,
        isControlled,
        getButtonProps,
        getDisclosureProps
    };
}

export type UseControllableReturn = ReturnType<typeof useControllable>;
