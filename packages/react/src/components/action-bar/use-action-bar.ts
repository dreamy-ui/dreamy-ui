"use client";

import { type HTMLProps, useCallback } from "react";
import { type PropGetter, useControllable } from "../..";

export interface UseActionBarProps {
    /**
     * Whether the action bar is open
     */
    isOpen?: boolean;
    /**
     * The default open state of the action bar
     */
    defaultIsOpen?: boolean;
    /**
     * Callback fired when the action bar opens
     */
    onOpen?(): void;
    /**
     * Callback fired when the action bar closes
     */
    onClose?(): void;
}

export interface UseActionBarReturn {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    getRootProps: () => HTMLProps<HTMLDivElement>;
    getPositionerProps: () => HTMLProps<HTMLDivElement>;
    getContentProps: () => HTMLProps<HTMLDivElement>;
    getSelectionTriggerProps: () => HTMLProps<HTMLSpanElement>;
    getSeparatorProps: () => HTMLProps<HTMLDivElement>;
    getCloseTriggerProps: () => HTMLProps<HTMLButtonElement>;
}

export function useActionBar(props: UseActionBarProps = {}): UseActionBarReturn {
    const { isOpen, onOpen, onClose, onToggle, getDisclosureProps } = useControllable(props);

    const getRootProps: PropGetter = useCallback(
        () =>
            ({
                "data-state": isOpen ? "open" : "closed"
            }) as HTMLProps<HTMLDivElement>,
        [isOpen]
    );

    const getPositionerProps: PropGetter = useCallback(
        () =>
            ({
                "data-state": isOpen ? "open" : "closed",
                style: {
                    position: "fixed" as const,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000
                }
            }) as HTMLProps<HTMLDivElement>,
        [isOpen]
    );

    const getContentProps: PropGetter = useCallback(
        () =>
            ({
                ...getDisclosureProps(),
                "data-state": isOpen ? "open" : "closed",
                role: "dialog",
                "aria-label": "Action bar"
            }) as HTMLProps<HTMLDivElement>,
        [isOpen, getDisclosureProps]
    );

    const getSelectionTriggerProps: PropGetter = useCallback(
        () =>
            ({
                "data-state": isOpen ? "open" : "closed"
            }) as HTMLProps<HTMLSpanElement>,
        [isOpen]
    );

    const getSeparatorProps: PropGetter = useCallback(
        () =>
            ({
                role: "separator" as const,
                "aria-orientation": "vertical" as const
            }) as HTMLProps<HTMLDivElement>,
        []
    );

    const getCloseTriggerProps: PropGetter = useCallback(
        () =>
            ({
                type: "button" as const,
                "aria-label": "Close action bar",
                onClick: onClose
            }) as HTMLProps<HTMLButtonElement>,
        [onClose]
    );

    return {
        isOpen,
        onOpen,
        onClose,
        onToggle,
        getRootProps,
        getPositionerProps,
        getContentProps,
        getSelectionTriggerProps,
        getSeparatorProps,
        getCloseTriggerProps
    };
}
