"use client";

import {
    type EditableActivationMode,
    type EditableEditingChangeReason,
    type EditableOptions,
    EditablePrimitiveParts,
    type EditableSubmitMode,
    type EditableValueChangeReason,
    type MaybeRenderProp,
    createEditableController,
    runIfFn,
    useFieldProps
} from "@dreamy-ui/react";
import type React from "react";
import { type CSSProperties, type ReactNode, createContext, useContext, useMemo } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, splitCssProps } from "styled-system/jsx";
import { type EditableVariantProps, editable } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(editable);

export { createEditableController };
export type {
    EditableActivationMode,
    EditableEditingChangeReason,
    EditableSubmitMode,
    EditableValueChangeReason
};

export interface EditableRenderState {
    editing: boolean;
    submit: () => void;
    cancel: () => void;
    edit: () => void;
}

interface EditableFieldContextValue {
    fieldId?: string;
    ariaDescribedBy?: string;
}

const EditableFieldContext = createContext<EditableFieldContextValue>({});

export interface EditableProps
    extends EditableOptions,
        EditableVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            keyof EditableOptions | "defaultValue" | "value" | "onChange" | "onSubmit" | "children"
        > {
    children?: MaybeRenderProp<EditableRenderState>;
}

function EditableChildren({ children }: { children?: MaybeRenderProp<EditableRenderState> }) {
    const { editing, edit, submit, cancel } = EditablePrimitiveParts.useState();
    return <>{runIfFn(children, { editing, edit, submit, cancel })}</>;
}

function EditableRoot(props: EditableProps) {
    const {
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
        id,
        children,
        className,
        style,
        ...rest
    } = props;

    const {
        isDisabled: isDisabledField = false,
        isReadOnly: isReadOnlyField = false,
        isInvalid: isInvalidField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedBy
    } = useFieldProps({
        isDisabled: disabled,
        isReadOnly: readOnly,
        isInvalid: invalid,
        id
    });

    const fieldValue = useMemo<EditableFieldContextValue>(
        () => ({ fieldId, ariaDescribedBy }),
        [ariaDescribedBy, fieldId]
    );
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditableFieldContext.Provider value={fieldValue}>
            <EditablePrimitiveParts.Root
                {...(domProps as Record<string, unknown>)}
                activationMode={activationMode}
                className={cx(className as string | undefined, css(cssProps))}
                controller={controller}
                debug={debug}
                defaultEditing={defaultEditing}
                defaultValue={defaultValue}
                disabled={disabled ?? isDisabledField}
                editing={editing}
                finalFocusRef={finalFocusRef}
                invalid={invalid ?? isInvalidField}
                onEditingChange={onEditingChange}
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
                onValueRevert={onValueRevert}
                placeholder={placeholder}
                readOnly={readOnly ?? isReadOnlyField}
                selectOnFocus={selectOnFocus}
                style={style as CSSProperties | undefined}
                submitMode={submitMode}
                value={value}
            >
                {typeof children === "function" ? (
                    <EditableChildren>{children}</EditableChildren>
                ) : (
                    children
                )}
            </EditablePrimitiveParts.Root>
        </EditableFieldContext.Provider>
    );
}

/**
 * Editable component — inline text field toggling between preview and edit mode.
 *
 * @see Docs https://dreamy-ui.com/docs/components/editable
 */
export const Root: (props: EditableProps) => React.JSX.Element = withProvider(
    EditableRoot,
    "root"
) as (props: EditableProps) => React.JSX.Element;

export interface EditablePreviewProps extends Omit<HTMLDreamyProps<"span">, "children"> {
    className?: string;
    children?: ReactNode;
}

export const Preview = withContext(function EditablePreview(props: EditablePreviewProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditablePrimitiveParts.Preview
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {(state) => children ?? (state.empty ? state.placeholder : state.value)}
        </EditablePrimitiveParts.Preview>
    );
}, "preview");

export interface EditableInputProps
    extends Omit<HTMLDreamyProps<"input">, "value" | "defaultValue" | "onChange"> {
    className?: string;
}

export const Input = withContext(function EditableInput(props: EditableInputProps) {
    const { className, style, id, "aria-describedby": ariaDescribedByProp, ...rest } = props;
    const { fieldId, ariaDescribedBy } = useContext(EditableFieldContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditablePrimitiveParts.Input
            {...(domProps as Record<string, unknown>)}
            aria-describedby={ariaDescribedByProp ?? ariaDescribedBy}
            className={cx(className as string | undefined, css(cssProps))}
            id={id ?? fieldId}
            style={style as CSSProperties | undefined}
        />
    );
}, "input");

export interface EditableEditButtonProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    className?: string;
    children?: ReactNode;
}

export const EditButton = withContext(function EditableEditButton(props: EditableEditButtonProps) {
    const { children, disabled, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditablePrimitiveParts.EditTrigger
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            style={style as CSSProperties | undefined}
        >
            {children ?? "Edit"}
        </EditablePrimitiveParts.EditTrigger>
    );
}, "editButton");

export interface EditableSubmitButtonProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    children?: ReactNode;
}

export const SubmitButton = withContext(function EditableSubmitButton(
    props: EditableSubmitButtonProps
) {
    const { children, disabled, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditablePrimitiveParts.SubmitTrigger
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            style={style as CSSProperties | undefined}
        >
            {children ?? "Submit"}
        </EditablePrimitiveParts.SubmitTrigger>
    );
}, "submitButton");

export interface EditableCancelButtonProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    children?: ReactNode;
}

export const CancelButton = withContext(function EditableCancelButton(
    props: EditableCancelButtonProps
) {
    const { children, disabled, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <EditablePrimitiveParts.CancelTrigger
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            style={style as CSSProperties | undefined}
        >
            {children ?? "Cancel"}
        </EditablePrimitiveParts.CancelTrigger>
    );
}, "cancelButton");
