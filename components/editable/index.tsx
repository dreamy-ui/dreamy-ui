"use client";

import { Editable as ArkEditable, useEditableContext } from "@ark-ui/react/editable";
import { type MaybeRenderProp, runIfFn, useSafeLayoutEffect } from "@dreamy-ui/react";
import { useRef } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type EditableVariantProps, editable } from "styled-system/recipes";
import { mapEditableRootProps } from "./map-editable-props";

export interface EditableProps
    extends Omit<
            React.ComponentProps<typeof ArkEditable.Root>,
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "onValueCommit"
            | "onValueRevert"
            | "defaultEdit"
            | "edit"
            | "disabled"
            | "activationMode"
            | "submitMode"
            | "selectOnFocus"
            | "placeholder"
            | "translations"
            | "children"
        >,
        EditableVariantProps,
        Partial<Pick<HTMLDreamyProps<"div">, "bg" | "color" | "p" | "m" | "w" | "h" | "className">> {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    onCancel?: (previousValue: string) => void;
    onEdit?: () => void;
    isEditing?: boolean;
    defaultIsEditing?: boolean;
    startWithEditView?: boolean;
    isDisabled?: boolean;
    useDoubleClick?: boolean;
    isPreviewFocusable?: boolean;
    submitOnBlur?: boolean;
    selectAllOnFocus?: boolean;
    placeholder?: string;
    children?: MaybeRenderProp<{
        isEditing: boolean;
        onSubmit: () => void;
        onCancel: () => void;
        onEdit: () => void;
    }>;
}

const { withProvider, withContext } = createStyleContext(editable);

function EditableContent(props: { children?: EditableProps["children"] }) {
    const api = useEditableContext();
    const contentRef = useRef<HTMLDivElement>(null);

    useSafeLayoutEffect(
        function focusInputOnEdit() {
            if (!api.editing) return;

            const input = contentRef.current?.querySelector<HTMLInputElement>(
                '[data-scope="editable"][data-part="input"]'
            );
            input?.focus({ preventScroll: true });
        },
        [api.editing]
    );

    const children = runIfFn(props.children, {
        isEditing: api.editing,
        onSubmit: api.submit,
        onCancel: api.cancel,
        onEdit: api.edit
    });

    return (
        <dreamy.div
            ref={contentRef}
            data-editable-state={api.editing ? "editing" : "view"}
            data-part="content"
        >
            {children}
        </dreamy.div>
    );
}

export const Root = withProvider(function EditableRoot(props: EditableProps) {
    const { arkProps, children } = mapEditableRootProps(
        props as Parameters<typeof mapEditableRootProps>[0]
    );

    return (
        <ArkEditable.Root {...arkProps}>
            <EditableContent children={children} />
        </ArkEditable.Root>
    );
}, "root");

export interface EditablePreviewProps extends HTMLDreamyProps<"span"> {
    className?: string;
}

export const Preview = withContext(ArkEditable.Preview, "preview");

export interface EditableInputProps extends HTMLDreamyProps<"input"> {
    className?: string;
}

export const Input = withContext(ArkEditable.Input, "input");

export interface EditableEditButtonProps extends HTMLDreamyProps<"button"> {
    className?: string;
    children?: React.ReactNode;
}

export const EditButton = withContext(function EditableEditButton(props: EditableEditButtonProps) {
    const { children, ...rest } = props;
    return <ArkEditable.EditTrigger {...rest}>{children ?? "Edit"}</ArkEditable.EditTrigger>;
}, "editButton");

interface EditableSubmitButtonProps extends HTMLDreamyProps<"button"> {
    className?: string;
    children?: React.ReactNode;
}

export const SubmitButton = withContext(function EditableSubmitButton(
    props: EditableSubmitButtonProps
) {
    const { children, ...rest } = props;
    return <ArkEditable.SubmitTrigger {...rest}>{children ?? "Submit"}</ArkEditable.SubmitTrigger>;
}, "submitButton");

interface EditableCancelButtonProps extends HTMLDreamyProps<"button"> {
    className?: string;
    children?: React.ReactNode;
}

export const CancelButton = withContext(function EditableCancelButton(
    props: EditableCancelButtonProps
) {
    const { children, ...rest } = props;
    return <ArkEditable.CancelTrigger {...rest}>{children ?? "Cancel"}</ArkEditable.CancelTrigger>;
}, "cancelButton");
