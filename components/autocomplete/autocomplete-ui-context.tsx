"use client";

import type { PositioningProps, UiSdkMotionController } from "@dreamy-ui/react";
import { createContext, useContext } from "react";

export interface AutocompleteItem {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface AutocompleteUiContextValue {
    items: AutocompleteItem[];
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    triggerVariant: string;
    clearable: boolean;
    reduceMotion: boolean;
    motion: UiSdkMotionController;
    positioning?: PositioningProps;
    inputFieldProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const AutocompleteUiContext = createContext<AutocompleteUiContextValue | null>(null);

export function AutocompleteUiProvider({
    value,
    children
}: {
    value: AutocompleteUiContextValue;
    children: React.ReactNode;
}) {
    return (
        <AutocompleteUiContext.Provider value={value}>{children}</AutocompleteUiContext.Provider>
    );
}

export function useAutocompleteUi() {
    const context = useContext(AutocompleteUiContext);
    if (!context) {
        throw new Error("useAutocompleteUi must be used within Autocomplete.Root");
    }
    return context;
}
