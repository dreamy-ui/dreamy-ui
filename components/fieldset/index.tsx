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
 * Fieldset component — groups related form controls under a shared legend.
 *
 * @see Docs https://dreamy-ui.com/docs/components/fieldset
 *
 * @example
 * ```tsx
 * <Fieldset.Root>
 *   <Fieldset.Legend>Contact details</Fieldset.Legend>
 *   <Fieldset.Content>
 *     <Input />
 *   </Fieldset.Content>
 * </Fieldset.Root>
 * ```
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
 * Fieldset Legend — caption describing the grouped controls.
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
 * Fieldset Helper Text — additional context for the fieldset.
 */
export const HelperText = withContext(dreamy.div, "helperText");

export interface FieldsetErrorTextProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Error Text — error message for the fieldset.
 */
export const ErrorText = withContext(dreamy.div, "errorText");

export interface FieldsetHeaderProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Header — wraps the legend and helper text.
 */
export const Header = withContext(dreamy.div, "header");

export interface FieldsetContentProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Content — container for the grouped form controls.
 */
export const Content = withContext(dreamy.div, "content");

export interface FieldsetFooterProps extends HTMLDreamyProps<"div"> {}

/**
 * Fieldset Footer — container for actions such as submit buttons.
 */
export const Footer = withContext(dreamy.div, "footer");
