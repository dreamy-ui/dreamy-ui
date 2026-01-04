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
import { forwardRef } from "react";
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
 * Editable component
 *
 * @see Docs https://dreamy-ui.com/docs/components/editable
 */
export const Root = withProvider(
    forwardRef<HTMLDivElement, EditableProps>(function EditableRoot(props, ref) {
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
                <Box {...context.getRootProps({}, ref)}>{children}</Box>
            </EditableProvider>
        );
    }),
    "root"
);

export interface EditablePreviewProps extends HTMLDreamyProps<"div"> {}

/**
 * EditablePreview component
 *
 * The `span` used to display the final value, in the `preview` mode
 */
export const Preview = withContext(
    forwardRef<HTMLSpanElement, EditablePreviewProps>(function EditablePreview(props, ref) {
        const { getPreviewProps } = useEditableContext();

        return <Box {...getPreviewProps(props, ref)} />;
    }),
    "preview"
);

export interface EditableInputProps extends HTMLDreamyProps<"input"> {}

/**
 * EditableInput component
 *
 * The input used in the `edit` mode
 */
export const Input = withContext(
    forwardRef<HTMLInputElement, EditableInputProps>(function EditableInput(props, ref) {
        const { getInputProps } = useEditableContext();

        return <dreamy.input {...getInputProps(props, ref)} />;
    }),
    "input"
);

export interface EditableEditButtonProps extends HTMLDreamyProps<"button"> {}

export const EditButton = withContext(
    forwardRef<HTMLButtonElement, EditableEditButtonProps>(function EditableEditButton(props, ref) {
        const { getEditButtonProps } = useEditableContext();

        return <dreamy.button {...getEditButtonProps(props, ref)} />;
    }),
    "editButton"
);

interface EditableSubmitButtonProps extends HTMLDreamyProps<"button"> {}

export const SubmitButton = withContext(
    forwardRef<HTMLButtonElement, EditableSubmitButtonProps>(
        function EditableSubmitButton(props, ref) {
            const { getSubmitButtonProps } = useEditableContext();

            return <dreamy.button {...getSubmitButtonProps(props, ref)} />;
        }
    ),
    "submitButton"
);

interface EditableCancelButtonProps extends HTMLDreamyProps<"button"> {}

export const CancelButton = withContext(
    forwardRef<HTMLButtonElement, EditableCancelButtonProps>(
        function EditableCancelButton(props, ref) {
            const { getCancelButtonProps } = useEditableContext();

            return <dreamy.button {...getCancelButtonProps(props, ref)} />;
        }
    ),
    "cancelButton"
);
