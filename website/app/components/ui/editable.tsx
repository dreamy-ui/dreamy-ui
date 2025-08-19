"use client";

import {
    EditableProvider,
    type UseEditableProps,
    type UseEditableReturn,
    runIfFn,
    useEditable,
    useEditableContext
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { createStyleContext } from "styled-system/jsx";
import { editable } from "styled-system/recipes";
import { Box } from "./box";
import { type HTMLDreamyProps, dreamy } from "./factory";

type RenderProps = Pick<UseEditableReturn, "isEditing" | "onSubmit" | "onCancel" | "onEdit">;

type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);

interface BaseEditableProps
    extends Omit<
        HTMLDreamyProps<"div">,
        "onChange" | "value" | "defaultValue" | "onSubmit" | "onBlur"
    > {}

export interface EditableProps extends UseEditableProps, Omit<BaseEditableProps, "children"> {
    children?: MaybeRenderProp<RenderProps>;
}

const { withProvider, withContext } = createStyleContext(editable);

/**
 * Editable component
 *
 * @see Docs https://dreamy-ui.com/docs/components/editable
 */
const EditableRoot = withProvider(
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
const EditablePreview = withContext(
    forwardRef<HTMLSpanElement, EditablePreviewProps>(function EditablePreview(props, ref) {
        const { getPreviewProps } = useEditableContext();

        return (
            <Box
                {...getPreviewProps(props, ref)}
                style={{
                    cursor: "text",
                    display: "inline-block",
                    ...props.style
                }}
            />
        );
    }),
    "preview"
);

export interface EditableInputProps extends HTMLDreamyProps<"input"> {}

/**
 * EditableInput component
 *
 * The input used in the `edit` mode
 */
const EditableInput = withContext(
    forwardRef<HTMLInputElement, EditableInputProps>(function EditableInput(props, ref) {
        const { getInputProps } = useEditableContext();

        return (
            <dreamy.input
                {...getInputProps(props, ref)}
                style={{
                    outline: 0,
                    borderRadius: "4px",
                    ...props.style
                }}
            />
        );
    }),
    "input"
);

export interface EditableEditButtonProps extends HTMLDreamyProps<"button"> {}

const EditableEditButton = withContext(
    forwardRef<HTMLButtonElement, EditableEditButtonProps>(function EditableEditButton(props, ref) {
        const { getEditButtonProps } = useEditableContext();

        return <dreamy.button {...getEditButtonProps(props, ref)} />;
    }),
    "editButton"
);

interface EditableSubmitButtonProps extends HTMLDreamyProps<"button"> {}

const EditableSubmitButton = withContext(
    forwardRef<HTMLButtonElement, EditableSubmitButtonProps>(
        function EditableSubmitButton(props, ref) {
            const { getSubmitButtonProps } = useEditableContext();

            return <dreamy.button {...getSubmitButtonProps(props, ref)} />;
        }
    ),
    "submitButton"
);

interface EditableCancelButtonProps extends HTMLDreamyProps<"button"> {}

const EditableCancelButton = withContext(
    forwardRef<HTMLButtonElement, EditableCancelButtonProps>(
        function EditableCancelButton(props, ref) {
            const { getCancelButtonProps } = useEditableContext();

            return <dreamy.button {...getCancelButtonProps(props, ref)} />;
        }
    ),
    "cancelButton"
);

export namespace Editable {
    export const Root = EditableRoot;
    export const Preview = EditablePreview;
    export const Input = EditableInput;
    export const EditButton = EditableEditButton;
    export const SubmitButton = EditableSubmitButton;
    export const CancelButton = EditableCancelButton;
}
