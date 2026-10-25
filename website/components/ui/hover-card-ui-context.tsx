"use client";

import type { PortalProps } from "@dreamy-ui/react";
import { createContext, useContext, useMemo, useState } from "react";

export interface HoverCardUiContextValue {
    hasArrow: boolean;
    usePortal: boolean;
    portalProps?: Omit<PortalProps, "children">;
    reduceMotion: boolean;
    contentLabelId: string | undefined;
    setContentLabelId: (id: string) => void;
    contentId: string | undefined;
    setContentId: (id: string) => void;
}

const HoverCardUiContext = createContext<HoverCardUiContextValue | null>(null);

export function HoverCardUiProvider({
    value,
    children
}: {
    value: Omit<
        HoverCardUiContextValue,
        "contentLabelId" | "setContentLabelId" | "contentId" | "setContentId"
    >;
    children: React.ReactNode;
}) {
    const [contentLabelId, setContentLabelId] = useState<string>();
    const [contentId, setContentId] = useState<string>();

    const merged = useMemo(
        () => ({
            ...value,
            contentLabelId,
            setContentLabelId,
            contentId,
            setContentId
        }),
        [contentId, contentLabelId, value]
    );

    return (
        <HoverCardUiContext.Provider value={merged}>{children}</HoverCardUiContext.Provider>
    );
}

export function useHoverCardUi() {
    const context = useContext(HoverCardUiContext);
    if (!context) {
        throw new Error("useHoverCardUi must be used within HoverCard.Root");
    }
    return context;
}
