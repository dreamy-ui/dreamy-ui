"use client";

import {
    EditableProvider,
    type MaybeRenderProp,
    type UseEditableProps,
    type UseEditableReturn,
    runIfFn,
    useEditable,
    useEditableContext
} from "@dreamy-ui/react";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { editable } from "styled-system/recipes";
import { Box } from "./box";

type RenderProps = Pick<UseEditableReturn, "isEditing" | "onSubmit" | "onCancel" | "onEdit">;

export interface EditableProps
    extends UseEditableProps,
        Omit<HTMLDreamyProps<"div">, keyof UseEditableProps | "children"> {
    children?: MaybeRenderProp<RenderProps>;
}

const { withProvider, withContext } = createStyleContext(editable);

/**
 * Editable component — inline text that toggles between preview and edit modes.
 *
 * @see Docs https://dreamy-ui.com/docs/components/editable
 *
 * @example
 * ```tsx
 * <Editable.Root defaultValue="Click to edit">
 *   <Editable.Preview />
 *   <Editable.Input />
 *   <Editable.EditButton />
 * </Editable.Root>
 * ```
 */
export const Root = withProvider(function EditableRoot(props: EditableProps) {
    const context = useEditable(props);

    const { isEditing, onSubmit, onCancel, onEdit } = context;

    const children = runIfFn(props.children, {
        isEditing,
        onSubmit,
        onCancel,
        onEdit
    });

    return (
        <EditableProvider value={context}>
            <Box {...context.getRootProps({ ref: props.ref })}>{children}</Box>
        </EditableProvider>
    );
}, "root");

export interface EditablePreviewProps extends HTMLDreamyProps<"div"> {}

/**
 * Editable Preview — read-only display shown when not editing.
 */
export const Preview = withContext(function EditablePreview(props: EditablePreviewProps) {
    const { getPreviewProps } = useEditableContext();

    return <Box {...getPreviewProps(props)} />;
}, "preview");

export interface EditableInputProps extends HTMLDreamyProps<"input"> {}

/**
 * Editable Input — text field shown in edit mode.
 */
export const Input = withContext(function EditableInput(props: EditableInputProps) {
    const { getInputProps } = useEditableContext();

    return <dreamy.input {...getInputProps(props)} />;
}, "input");

export interface EditableEditButtonProps extends HTMLDreamyProps<"button"> {}

/**
 * Editable Edit Button — enters edit mode.
 */
export const EditButton = withContext(function EditableEditButton(props: EditableEditButtonProps) {
    const { getEditButtonProps } = useEditableContext();

    return <dreamy.button {...getEditButtonProps(props)} />;
}, "editButton");

interface EditableSubmitButtonProps extends HTMLDreamyProps<"button"> {}

/**
 * Editable Submit Button — saves the edited value.
 */
export const SubmitButton = withContext(function EditableSubmitButton(
    props: EditableSubmitButtonProps
) {
    const { getSubmitButtonProps } = useEditableContext();

    return <dreamy.button {...getSubmitButtonProps(props)} />;
}, "submitButton");

interface EditableCancelButtonProps extends HTMLDreamyProps<"button"> {}

/**
 * Editable Cancel Button — discards edits and returns to preview mode.
 */
export const CancelButton = withContext(function EditableCancelButton(
    props: EditableCancelButtonProps
) {
    const { getCancelButtonProps } = useEditableContext();

    return <dreamy.button {...getCancelButtonProps(props)} />;
}, "cancelButton");
