"use client";

import type { PortalProps } from "@dreamy-ui/react";
import { createContext, useContext } from "react";

export interface MenuUiContextValue {
    reduceMotion: boolean;
    usePortal: boolean;
    portalProps?: Omit<PortalProps, "children">;
}

const MenuUiContext = createContext<MenuUiContextValue | null>(null);

export function MenuUiProvider({
    value,
    children
}: {
    value: MenuUiContextValue;
    children: React.ReactNode;
}) {
    return <MenuUiContext.Provider value={value}>{children}</MenuUiContext.Provider>;
}

export function useMenuUi() {
    const context = useContext(MenuUiContext);
    if (!context) {
        throw new Error("useMenuUi must be used within Menu.Root");
    }
    return context;
}
