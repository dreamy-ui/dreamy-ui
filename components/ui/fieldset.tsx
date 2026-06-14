"use client";

import { forwardRef } from "react";
import { createStyleContext, type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { fieldset } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(fieldset);

export interface FieldsetRootProps extends HTMLDreamyProps<"fieldset"> {
    /**
     * If `true`, the fieldset will be disabled.
     */
    disabled?: boolean;
    /**
     * If `true`, the fieldset will be marked as invalid.
     */
    invalid?: boolean;
}

/**
 * Fieldset Root component - wraps form controls under a common name
 *
 * @See Docs https://dreamy-ui.com/docs/components/fieldset
 */
export const Root = withProvider(
    forwardRef<HTMLFieldSetElement, FieldsetRootProps>(function FieldsetRoot(props, ref) {
        const { disabled, invalid, ...rest } = props;
        return (
            <dreamy.fieldset
                ref={ref}
                disabled={disabled}
                aria-invalid={invalid}
                data-invalid={invalid ? "" : undefined}
                data-disabled={disabled ? "" : undefined}
                {...rest}
            />
        );
    }),
    "root"
);

export interface FieldsetLegendProps extends HTMLDreamyProps<"legend"> {}

/**
 * Fieldset Legend component - provides a caption for the fieldset
 */
export const Legend = withContext(dreamy.legend, "legend");

export interface FieldsetHelperTextProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Helper Text component - provides additional context
 */
export const HelperText = withContext(dreamy.div, "helperText");

export interface FieldsetErrorTextProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Error Text component - displays error messages
 */
export const ErrorText = withContext(dreamy.div, "errorText");

export interface FieldsetHeaderProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Header component - wraps legend and helper text
 */
export const Header = withContext(dreamy.div, "header");

export interface FieldsetContentProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Content component - wraps the form controls
 */
export const Content = withContext(dreamy.div, "content");

export interface FieldsetFooterProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Footer component - wraps submit buttons and actions
 */
export const Footer = withContext(dreamy.div, "footer");
