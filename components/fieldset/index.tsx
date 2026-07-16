"use client";

import { createContext } from "@dreamy-ui/react";
import { useId } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { fieldset } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(fieldset);

interface FieldsetContextValue {
    legendId: string;
}

const [FieldsetProvider, useFieldsetContext] = createContext<FieldsetContextValue>({
    strict: false,
    name: "FieldsetContext"
});

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
export const Root = withProvider(function FieldsetRoot(props: FieldsetRootProps) {
    const { disabled, invalid, ...rest } = props;
    const legendId = useId();

    return (
        <FieldsetProvider value={{ legendId }}>
            <dreamy.fieldset
                {...rest}
                aria-invalid={invalid}
                aria-labelledby={legendId}
                data-disabled={disabled ? "" : undefined}
                data-invalid={invalid ? "" : undefined}
                disabled={disabled}
            />
        </FieldsetProvider>
    );
}, "root");

export interface FieldsetLegendProps extends HTMLDreamyProps<"legend"> {}

/**
 * Fieldset Legend component - provides a caption for the fieldset
 */
export const Legend = withContext(function FieldsetLegend(props: FieldsetLegendProps) {
    const fieldset = useFieldsetContext();

    return (
        <dreamy.legend
            {...props}
            id={props.id ?? fieldset?.legendId}
        />
    );
}, "legend");

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
