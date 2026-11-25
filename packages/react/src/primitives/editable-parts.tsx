"use client";

import {
    type PartProps,
    type PrimitiveHandle,
    createParts,
    usePart,
    usePrimitive
} from "@ui-sdk/react/primitive";
import { createContext, useContext, useSyncExternalStore } from "react";
import {
    type EditableOptions,
    type EditablePrimitive,
    type EditableRootState,
    editablePrimitive
} from "./editable";

const parts = createParts(editablePrimitive, {
    preview: "span",
    input: "input",
    "edit-trigger": "button",
    "submit-trigger": "button",
    "cancel-trigger": "button"
});

const EditableHandleContext = createContext<PrimitiveHandle<EditablePrimitive> | null>(null);

export type EditablePrimitiveRootProps = EditableOptions &
    Omit<PartProps<"div", EditableRootState>, keyof EditableOptions>;

function EditableRoot({
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    onValueRevert,
    editing,
    defaultEditing,
    onEditingChange,
    disabled,
    readOnly,
    invalid,
    activationMode,
    submitMode,
    selectOnFocus,
    placeholder,
    finalFocusRef,
    controller,
    debug,
    ...props
}: EditablePrimitiveRootProps) {
    const handle = usePrimitive(editablePrimitive, {
        value,
        defaultValue,
        onValueChange,
        onValueCommit,
        onValueRevert,
        editing,
        defaultEditing,
        onEditingChange,
        disabled,
        readOnly,
        invalid,
        activationMode,
        submitMode,
        selectOnFocus,
        placeholder,
        finalFocusRef,
        controller,
        debug
    });

    return (
        <EditableHandleContext.Provider value={handle}>
            {usePart(handle, "root", {}, props, "div")}
        </EditableHandleContext.Provider>
    );
}

export interface EditablePrimitiveState {
    value: string;
    editing: boolean;
    disabled: boolean;
    readOnly: boolean;
    invalid: boolean;
    placeholder: string;
    edit: () => void;
    submit: () => void;
    cancel: () => void;
}

export function useEditablePrimitive(): EditablePrimitiveState {
    const handle = useContext(EditableHandleContext);
    if (!handle) {
        throw new Error("Editable sub-components must be used within Editable.Root");
    }

    const snapshot = useSyncExternalStore(
        handle.instance.subscribe,
        handle.instance.get,
        handle.instance.get
    );

    return {
        value: snapshot.value,
        editing: snapshot.editing,
        disabled: snapshot.disabled,
        readOnly: snapshot.readOnly,
        invalid: snapshot.invalid,
        placeholder: snapshot.placeholder,
        edit: () => {
            handle.api.edit();
        },
        submit: () => {
            handle.api.submit();
        },
        cancel: () => {
            handle.api.cancel();
        }
    };
}

export const EditablePrimitiveParts = {
    Root: EditableRoot,
    Preview: parts.Preview,
    Input: parts.Input,
    EditTrigger: parts.EditTrigger,
    SubmitTrigger: parts.SubmitTrigger,
    CancelTrigger: parts.CancelTrigger,
    useState: useEditablePrimitive
};
