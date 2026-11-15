"use client";

import type { PositioningProps } from "@dreamy-ui/react";
import type {
    PopoverFinalFocus,
    PopoverInitialFocus
} from "@ui-sdk/react/popover";
import { createContext, useContext } from "react";

export type PopoverTriggerMode = "click" | "hover";

export interface PopoverUiContextValue {
    hasArrow: boolean;
    arrowSize?: number;
    arrowShadowColor?: string;
    trigger: PopoverTriggerMode;
    reduceMotion: boolean;
    positioning?: PositioningProps;
    initialFocus?: PopoverInitialFocus;
    finalFocus?: PopoverFinalFocus;
    keepMounted?: boolean;
    container?: Element | DocumentFragment | null;
    anchor: HTMLElement | null;
    setAnchor: (element: HTMLElement | null) => void;
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
