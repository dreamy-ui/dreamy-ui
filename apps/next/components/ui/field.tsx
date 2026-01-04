"use client";

import {
    FieldProvider,
    type UserFeedbackProps,
    useFieldContext,
    useFieldProvider
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type FieldVariantProps, field } from "styled-system/recipes";
import { Box } from "./box";
import { Icon, type IconProps } from "./icon";

export interface FieldLabelProps extends HTMLDreamyProps<"label"> {
    requiredIndicator?: React.ReactNode;
    optionalIndicator?: React.ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(props, ref) {
    const {
        children,
        requiredIndicator = <RequiredIndicator />,
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

export interface RequiredIndicatorProps extends HTMLDreamyProps<"span"> { }

/**
 * Used to show a "required" text or an asterisks (*) to indicate that
 * a field is required.
 */
export const RequiredIndicator = forwardRef<HTMLSpanElement, RequiredIndicatorProps>(
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

export interface FieldErrorProps extends HTMLDreamyProps<"label"> { }

export const Error = forwardRef<HTMLLabelElement, FieldErrorProps>(function FieldError(props, ref) {
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
export const ErrorIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const field = useFieldContext();

    if (!field?.isInvalid) return null;

    return (
        <Icon
            aria-hidden
            data-part="errorIcon"
            ref={ref}
            size={"sm"}
            {...props}
        >
            <svg
                aria-label="Error"
                fill="currentColor"
                role="img"
                viewBox="0 0 24 24"
            >
                <path
                    d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                    fill="currentColor"
                />
            </svg>
        </Icon>
    );
});

export interface FieldHintProps extends HTMLDreamyProps<"div"> { }

export const Hint = forwardRef<HTMLDivElement, FieldHintProps>(function FieldHint(props, ref) {
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
export const Root = forwardRef<HTMLDivElement, FieldProps>(function Field(
    { children, label, hint, error, ...props },
    ref
) {
    const { getRootProps, htmlProps: _, ...context } = useFieldProvider(props);

    return (
        <FieldProvider value={context}>
            <StyledField {...getRootProps({}, ref)}>
                {label ? <Label>{label}</Label> : null}
                {children}
                {hint && <Hint>{hint}</Hint>}
                {error && <Error>{error}</Error>}
            </StyledField>
        </FieldProvider>
    );
});
