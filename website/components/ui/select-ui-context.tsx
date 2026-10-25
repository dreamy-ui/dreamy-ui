"use client";

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
    isClearable: boolean;
    triggerFieldProps: React.HTMLAttributes<HTMLElement>;
    onSingleValueChange?: (value: string) => void;
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
