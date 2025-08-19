"use client";

import {
    FieldProvider,
    type UserFeedbackProps,
    useFieldContext,
    useFieldProvider
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type FieldVariantProps, field } from "styled-system/recipes";
import { Box } from "./box";
import { type HTMLDreamyProps, dreamy } from "./factory";
import { Icon, type IconProps } from "./icon";

export interface FieldLabelProps extends HTMLDreamyProps<"label"> {
    requiredIndicator?: React.ReactNode;
    optionalIndicator?: React.ReactNode;
}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(props, ref) {
    const {
        children,
        requiredIndicator = <FieldRequiredIndicator />,
        optionalIndicator = null,
        ...rest
    } = props;

    const field = useFieldContext();
    const ownProps = field?.getLabelProps(rest, ref) ?? { ref, ...rest };

    return (
        <Box
            as={"label"}
            data-part="label"
            {...ownProps}
        >
            {children}
            {field?.isRequired ? requiredIndicator : optionalIndicator}
        </Box>
    );
});

export interface RequiredIndicatorProps extends HTMLDreamyProps<"span"> {}

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
const FieldRequiredIndicator = forwardRef<HTMLSpanElement, RequiredIndicatorProps>(
    function RequiredIndicator(props, ref) {
        const field = useFieldContext();

        if (!field?.isRequired) return null;

        return (
            <Box
                as={"span"}
                data-part="requiredIndicator"
                {...field?.getRequiredIndicatorProps(props, ref)}
            />
        );
    }
);

export interface FieldErrorProps extends HTMLDreamyProps<"label"> {}

const FieldError = forwardRef<HTMLLabelElement, FieldErrorProps>(function FieldError(props, ref) {
    const field = useFieldContext();

    if (!field?.isInvalid) return null;

    return (
        <Box
            data-part="error"
            {...field?.getErrorMessageProps(props, ref)}
        />
    );
});

/**
 * Used as the visual indicator that a field is invalid or
 * a field has incorrect values.
 */
const FieldErrorIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const field = useFieldContext();

    if (!field?.isInvalid) return null;

    return (
        <Icon
            ref={ref}
            aria-hidden
            size={"sm"}
            data-part="errorIcon"
            {...props}
        >
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="Error"
            >
                <path
                    fill="currentColor"
                    d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                />
            </svg>
        </Icon>
    );
});

export interface FieldHintProps extends HTMLDreamyProps<"div"> {}

const FieldHint = forwardRef<HTMLDivElement, FieldHintProps>(function FieldHint(props, ref) {
    const field = useFieldContext();

    if (field?.isInvalid) return null;

    return (
        <Box
            data-part="hint"
            {...field?.getHintProps(props, ref)}
        />
    );
});

interface FieldContext extends UserFeedbackProps {
    /**
     * The label text used to inform users as to what information is
     * requested for a text field.
     */
    label?: string;
    /**
     * The custom `id` to use for the form control. This is passed directly to the form element (e.g, Input).
     * - The form element (e.g. Input) gets the `id`
     * - The form label id: `form-label-${id}`
     * - The form error text id: `form-error-text-${id}`
     * - The form hint id: `form-hint-${id}`
     */
    id?: string;
}

export interface FieldProps extends HTMLDreamyProps<"div">, FieldContext, FieldVariantProps {
    hint?: string;
    error?: string;
}

const StyledField = dreamy("div", field);

/**
 * Field component
 *
 * @See Docs https://dreamy-ui.com/docs/components/field
 */
const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(function Field(
    { children, label, hint, error, ...props },
    ref
) {
    const { getRootProps, htmlProps: _, ...context } = useFieldProvider(props);

    return (
        <FieldProvider value={context}>
            <StyledField {...getRootProps({}, ref)}>
                {label ? <FieldLabel>{label}</FieldLabel> : null}
                {children}
                {hint && <FieldHint>{hint}</FieldHint>}
                {error && <FieldError>{error}</FieldError>}
            </StyledField>
        </FieldProvider>
    );
});

export namespace Field {
    export const Root = FieldRoot;
    export const Label = FieldLabel;
    export const RequiredIndicator = FieldRequiredIndicator;
    export const Error = FieldError;
    export const ErrorIcon = FieldErrorIcon;
    export const Hint = FieldHint;
}
