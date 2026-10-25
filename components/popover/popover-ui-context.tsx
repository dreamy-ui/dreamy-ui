"use client";

import type { PortalProps } from "@dreamy-ui/react";
import { createContext, useContext } from "react";

export type PopoverTriggerMode = "click" | "hover";

export interface PopoverUiContextValue {
    hasArrow: boolean;
    usePortal: boolean;
    portalProps?: Omit<PortalProps, "children">;
    reduceMotion: boolean;
    arrowSize?: number;
    arrowShadowColor?: string;
    trigger: PopoverTriggerMode;
    contentHoverProps?: {
        onPointerEnter?: React.PointerEventHandler<HTMLElement>;
        onPointerLeave?: React.PointerEventHandler<HTMLElement>;
    };
    triggerHoverProps?: {
        onPointerEnter?: React.PointerEventHandler<HTMLElement>;
        onPointerLeave?: React.PointerEventHandler<HTMLElement>;
        onFocus?: React.FocusEventHandler<HTMLElement>;
        onBlur?: React.FocusEventHandler<HTMLElement>;
        onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    };
    onClose: () => void;
    onExitComplete: () => void;
    present: boolean;
}

const PopoverUiContext = createContext<PopoverUiContextValue | null>(null);

export function PopoverUiProvider({
    value,
    children
}: {
    value: PopoverUiContextValue;
    children: React.ReactNode;
}) {
    return <PopoverUiContext.Provider value={value}>{children}</PopoverUiContext.Provider>;
}

export function usePopoverUi() {
    const context = useContext(PopoverUiContext);
    if (!context) {
        throw new Error("usePopoverUi must be used within Popover.Root");
    }
    return context;
}
