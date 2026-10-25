"use client";

import { createContext, useContext } from "react";

export interface AutocompleteItem {
    value: string;
    label: string;
}

export interface AutocompleteUiContextValue {
    visibleItems: AutocompleteItem[];
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    triggerVariant: string;
    isClearable: boolean;
    inputFieldProps: React.InputHTMLAttributes<HTMLInputElement>;
    onInputValueChange: (inputValue: string) => void;
    onChangeValue?: (value: string | null) => void;
}

const AutocompleteUiContext = createContext<AutocompleteUiContextValue | null>(null);

export function AutocompleteUiProvider({
    value,
    children
}: {
    value: AutocompleteUiContextValue;
    children: React.ReactNode;
}) {
    return <AutocompleteUiContext.Provider value={value}>{children}</AutocompleteUiContext.Provider>;
}

export function useAutocompleteUi() {
    const context = useContext(AutocompleteUiContext);
    if (!context) {
        throw new Error("useAutocompleteUi must be used within Autocomplete.Root");
    }
    return context;
}
