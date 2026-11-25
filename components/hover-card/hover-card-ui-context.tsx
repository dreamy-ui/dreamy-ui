"use client";

import type { PositioningProps, UiSdkMotionController } from "@dreamy-ui/react";
import { createContext, useContext } from "react";

export interface HoverCardUiContextValue {
    hasArrow: boolean;
    arrowSize?: number;
    reduceMotion: boolean;
    motion: UiSdkMotionController;
    positioning?: PositioningProps;
}

const HoverCardUiContext = createContext<HoverCardUiContextValue | null>(null);

export function HoverCardUiProvider({
    value,
    children
}: {
    value: HoverCardUiContextValue;
    children: React.ReactNode;
}) {
    return <HoverCardUiContext.Provider value={value}>{children}</HoverCardUiContext.Provider>;
}

export function useHoverCardUi() {
    const context = useContext(HoverCardUiContext);
    if (!context) {
        throw new Error("useHoverCardUi must be used within HoverCard.Root");
    }
    return context;
}
