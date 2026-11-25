"use client";

import {
    type DreamyHostProps,
    FieldProvider,
    useFieldContext,
    useFieldProvider
} from "@dreamy-ui/react";
import {
    type FieldOptions,
    Field as UiSdkField,
    FieldControl as UiSdkFieldControl,
    FieldDescription as UiSdkFieldDescription,
    FieldError as UiSdkFieldError,
    type FieldErrorProps as UiSdkFieldErrorProps,
    FieldGroup as UiSdkFieldGroup,
    FieldLabel as UiSdkFieldLabel,
    FieldLegend as UiSdkFieldLegend,
    FieldSet as UiSdkFieldSet,
    useFieldControl
} from "@ui-sdk/react/field";
import type React from "react";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy, splitCssProps } from "styled-system/jsx";
import { type FieldVariantProps, field } from "styled-system/recipes";
import { Box } from "../box";
import { Icon, type IconProps } from "../icon";

export { useFieldControl };
export {
    UiSdkFieldControl as Control,
    UiSdkFieldGroup as Group,
    UiSdkFieldLegend as Legend,
    UiSdkFieldSet as Set
};

export interface FieldLabelProps extends Omit<HTMLDreamyProps<"label">, "children"> {
    requiredIndicator?: ReactNode;
    optionalIndicator?: ReactNode;
    children?: ReactNode;
}

/**
 * Field Label — accessible label for the form control powered by UI SDK `FieldLabel`.
 */
export function Label(props: FieldLabelProps) {
    const {
        children,
        requiredIndicator = <RequiredIndicator />,
        optionalIndicator = null,
        id,
        className,
        style,
        htmlFor,
        ...rest
    } = props;

    const fieldCtx = useFieldContext();
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedHtmlFor = (htmlFor as string | undefined) ?? fieldCtx?.id;

    return (
        <UiSdkFieldLabel
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFieldLabel>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-part="label"
            id={(id as string | undefined) ?? fieldCtx?.labelId}
            render={(labelProps) => (
                <label
                    {...labelProps}
                    htmlFor={resolvedHtmlFor ?? labelProps.htmlFor}
                />
            )}
            style={style as CSSProperties | undefined}
        >
            {(state) => (
                <>
                    {children}
                    {fieldCtx?.isRequired || state.required ? requiredIndicator : optionalIndicator}
                </>
            )}
        </UiSdkFieldLabel>
    );
}

export interface RequiredIndicatorProps extends HTMLDreamyProps<"span"> {}

/**
 * Field Required Indicator — marks the field as required.
 */
export function RequiredIndicator(props: RequiredIndicatorProps) {
    const { children = "*", ...rest } = props;

    return (
        <dreamy.span
            aria-hidden="true"
            data-part="requiredIndicator"
            role="presentation"
            {...rest}
        >
            {children}
        </dreamy.span>
    );
}

export interface FieldErrorProps
    extends Omit<HTMLDreamyProps<"div">, "children">,
        Pick<UiSdkFieldErrorProps, "match"> {
    children?: ReactNode;
}

/**
 * Field Error — validation message shown when the field is invalid powered by UI SDK `FieldError`.
 */
export function Error(props: FieldErrorProps) {
    const { match, children, id, className, style, ...rest } = props;
    const fieldCtx = useFieldContext();
    const [cssProps, domProps] = splitCssProps(rest);
    const isExternallyInvalid = Boolean(fieldCtx?.isInvalid);

    useEffect(() => {
        if (!fieldCtx) return;
        fieldCtx.setHasFeedbackText(isExternallyInvalid);
        return () => fieldCtx.setHasFeedbackText(false);
    }, [fieldCtx, isExternallyInvalid]);

    return (
        <UiSdkFieldError
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFieldError>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-part="error"
            id={(id as string | undefined) ?? fieldCtx?.feedbackId}
            match={match ?? (isExternallyInvalid ? true : undefined)}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkFieldError>
    );
}

/**
 * Field Error Icon — visual indicator that the field is invalid.
 */
export function ErrorIcon(props: IconProps) {
    return (
        <Icon
            aria-hidden="true"
            data-part="errorIcon"
            size={"sm"}
            {...props}
        >
            <svg
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                    fill="currentColor"
                />
            </svg>
        </Icon>
    );
}

export interface FieldHintProps extends Omit<HTMLDreamyProps<"p">, "children"> {
    children?: ReactNode;
}

/**
 * Field Hint — helper text shown when the field is valid powered by UI SDK `FieldDescription`.
 */
export function Hint(props: FieldHintProps) {
    const { children, id, className, style, ...rest } = props;
    const fieldCtx = useFieldContext();
    const [cssProps, domProps] = splitCssProps(rest);
    const isHidden = Boolean(fieldCtx?.isInvalid);

    useEffect(() => {
        if (!fieldCtx) return;
        fieldCtx.setHasHint(!isHidden);
        return () => fieldCtx.setHasHint(false);
    }, [fieldCtx, isHidden]);

    if (isHidden) {
        return null;
    }

    return (
        <UiSdkFieldDescription
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFieldDescription>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-part="hint"
            id={(id as string | undefined) ?? fieldCtx?.hintId}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkFieldDescription>
    );
}

export interface FieldProps
    extends FieldOptions,
        FieldVariantProps,
        DreamyHostProps<
            HTMLDreamyProps<"div">,
            FieldOptions,
            "id" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        > {
    /**
     * Marks the field as required.
     */
    required?: boolean;
    /**
     * Marks the field as read-only.
     */
    readOnly?: boolean;
    /**
     * Custom `id` propagated to the form control and used to derive label/hint/error IDs.
     */
    id?: string;
    /**
     * Shorthand label text rendered via `Field.Label`.
     */
    label?: string;
    /**
     * Shorthand helper text rendered via `Field.Hint`.
     */
    hint?: string;
    /**
     * Shorthand error text rendered via `Field.Error`.
     */
    error?: string;
    children?: ReactNode;
}

const StyledField = dreamy("div", field);

/**
 * Field component — wraps a control with label, hint, and error messaging powered by UI SDK `Field`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/field
 *
 * @example
 * ```tsx
 * <Field.Root label="Email">
 *   <Input type="email" />
 * </Field.Root>
 * ```
 */
export function Root(props: FieldProps) {
    const {
        children,
        label,
        hint,
        error,
        name,
        disabled,
        invalid,
        required,
        readOnly,
        debug,
        id,
        orientation,
        className,
        ...rest
    } = props;

    const { getRootProps: _, htmlProps: __, ...context } = useFieldProvider({
        id,
        isDisabled: disabled,
        isInvalid: invalid,
        isRequired: required,
        isReadOnly: readOnly
    });

    return (
        <FieldProvider value={context}>
            <UiSdkField
                debug={debug}
                disabled={disabled}
                invalid={invalid}
                name={name}
                render={
                    <StyledField
                        className={className}
                        orientation={orientation}
                        {...rest}
                    />
                }
            >
                {label ? <Label>{label}</Label> : null}
                {children}
                {hint ? <Hint>{hint}</Hint> : null}
                {error ? <Error>{error}</Error> : null}
            </UiSdkField>
        </FieldProvider>
    );
}
