"use client";

import type { PositioningProps, UiSdkMotionController } from "@dreamy-ui/react";
import { createContext, useContext } from "react";

export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectUiContextValue {
    items: SelectItemData[];
    renderItem?: (item: SelectItemData) => React.ReactNode;
    selectedStrategy: "checkmark" | "background" | "both";
    clearable: boolean;
    multiple: boolean;
    reduceMotion: boolean;
    motion: UiSdkMotionController;
    positioning?: PositioningProps;
    triggerFieldProps: React.HTMLAttributes<HTMLElement>;
}

const SelectUiContext = createContext<SelectUiContextValue | null>(null);

export function SelectUiProvider({
    value,
    children
}: {
    value: SelectUiContextValue;
    children: React.ReactNode;
}) {
    return <SelectUiContext.Provider value={value}>{children}</SelectUiContext.Provider>;
}

export function useSelectUi() {
    const context = useContext(SelectUiContext);
    if (!context) {
        throw new Error("useSelectUi must be used within Select.Root");
    }
    return context;
}
