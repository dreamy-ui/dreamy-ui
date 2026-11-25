"use client";

import {
    type PartProps,
    type PrimitiveHandle,
    createParts,
    usePart,
    usePrimitive
} from "@ui-sdk/react/primitive";
import { type ReactNode, createContext, useContext, useSyncExternalStore } from "react";
import {
    type ActionBarOptions,
    type ActionBarPartState,
    type ActionBarPrimitive,
    actionBarPrimitive
} from "./action-bar";

const parts = createParts(actionBarPrimitive, {
    content: "div",
    "selection-trigger": "span",
    separator: "div",
    "close-trigger": "button"
});

const ActionBarHandleContext = createContext<PrimitiveHandle<ActionBarPrimitive> | null>(null);

export interface ActionBarPrimitiveProviderProps extends ActionBarOptions {
    children?: ReactNode | ((state: ActionBarPartState) => ReactNode);
}

function ActionBarProvider({
    open,
    defaultOpen,
    onOpenChange,
    closeOnEscape,
    loop,
    controller,
    debug,
    children
}: ActionBarPrimitiveProviderProps) {
    const handle = usePrimitive(actionBarPrimitive, {
        open,
        defaultOpen,
        onOpenChange,
        closeOnEscape,
        loop,
        controller,
        debug
    });

    const snapshot = useSyncExternalStore(
        handle.instance.subscribe,
        handle.instance.get,
        handle.instance.get
    );

    return (
        <ActionBarHandleContext.Provider value={handle}>
            {typeof children === "function" ? children({ open: snapshot.open }) : children}
        </ActionBarHandleContext.Provider>
    );
}

function ActionBarSurface(props: PartProps<"div", ActionBarPartState>) {
    const handle = useContext(ActionBarHandleContext);
    if (!handle) {
        throw new Error("ActionBar parts must be used within ActionBar.Root");
    }
    return usePart(handle, "root", {}, props, "div");
}

export function useActionBarPrimitive() {
    const handle = useContext(ActionBarHandleContext);
    if (!handle) {
        throw new Error("ActionBar parts must be used within ActionBar.Root");
    }

    const snapshot = useSyncExternalStore(
        handle.instance.subscribe,
        handle.instance.get,
        handle.instance.get
    );

    return {
        open: snapshot.open,
        setOpen: handle.api.setOpen,
        close: handle.api.close
    };
}

export const ActionBarPrimitiveParts = {
    Provider: ActionBarProvider,
    Surface: ActionBarSurface,
    Content: parts.Content,
    SelectionTrigger: parts.SelectionTrigger,
    Separator: parts.Separator,
    CloseTrigger: parts.CloseTrigger,
    useState: useActionBarPrimitive
};
