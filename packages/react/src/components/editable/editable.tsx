import { runIfFn } from "@/utils/run-if-fn";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { editable } from "styled-system/recipes";
import { Box } from "../box/box";
import { dreamy } from "../factory";
import { createStyleContext } from "../style-context";
import {
    EditableProvider,
    type UseEditableProps,
    type UseEditableReturn,
    useEditable,
    useEditableContext
} from "./use-editable";

type RenderProps = Pick<UseEditableReturn, "isEditing" | "onSubmit" | "onCancel" | "onEdit">;

type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);

interface BaseEditableProps
    extends Omit<
        HTMLDreamProps<"div">,
        "onChange" | "value" | "defaultValue" | "onSubmit" | "onBlur"
    > {}

export interface EditableProps extends UseEditableProps, Omit<BaseEditableProps, "children"> {
    children?: MaybeRenderProp<RenderProps>;
}

const { withProvider, withContext } = createStyleContext(editable);

/**
 * Editable
 *
 * The wrapper that provides context and logic for all editable
 * components. It renders a `div`
 *
 * @see Docs https://dreamy-ui.com/docs/components/editable
 */
export const Editable = withProvider(
    forwardRef<HTMLDivElement, EditableProps>(function Editable(props, ref) {
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

export interface EditablePreviewProps extends HTMLDreamProps<"div"> {}

/**
 * EditablePreview
 *
 * The `span` used to display the final value, in the `preview` mode
 */
export const EditablePreview = withContext(
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

export interface EditableInputProps extends HTMLDreamProps<"input"> {}

/**
 * EditableInput
 *
 * The input used in the `edit` mode
 */
export const EditableInput = withContext(
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

export interface EditableEditButtonProps extends HTMLDreamProps<"button"> {}

export const EditableEditButton = withContext(
    forwardRef<HTMLButtonElement, EditableEditButtonProps>(function EditableEditButton(props, ref) {
        const { getEditButtonProps } = useEditableContext();

        return <dreamy.button {...getEditButtonProps(props, ref)} />;
    }),
    "editButton"
);

interface EditableSubmitButtonProps extends HTMLDreamProps<"button"> {}

export const EditableSubmitButton = withContext(
    forwardRef<HTMLButtonElement, EditableSubmitButtonProps>(
        function EditableSubmitButton(props, ref) {
            const { getSubmitButtonProps } = useEditableContext();

            return <dreamy.button {...getSubmitButtonProps(props, ref)} />;
        }
    ),
    "submitButton"
);

interface EditableCancelButtonProps extends HTMLDreamProps<"button"> {}

export const EditableCancelButton = withContext(
    forwardRef<HTMLButtonElement, EditableCancelButtonProps>(
        function EditableCancelButton(props, ref) {
            const { getCancelButtonProps } = useEditableContext();

            return <dreamy.button {...getCancelButtonProps(props, ref)} />;
        }
    ),
    "cancelButton"
);
