"use client";

import { type UserFeedbackProps, callAllHandlers, createContext, useField } from "@dreamy-ui/react";
import type React from "react";
import { useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy, splitCssProps } from "styled-system/jsx";
import { type InputVariantProps, input } from "styled-system/recipes";
import { type InputGroupVariantProps, inputGroup } from "styled-system/recipes";

const StyledInput = dreamy("input", input);
const { withProvider, withContext } = createStyleContext(inputGroup);

const [InputGroupProvider, useInputGroup] = createContext<InputGroupProviderContext>({
    strict: false,
    name: "InputGroupContext"
});

interface InputGroupProviderContext extends InputVariantProps, UserFeedbackProps {}

export interface InputProps
    extends Omit<HTMLDreamyProps<"input">, "size">,
        InputVariantProps,
        UserFeedbackProps {
    /**
     * The callback function that is called when the input value changes.
     */
    onChangeValue?: (value: string) => void;
}

export interface InputGroupProps
    extends InputGroupProviderContext,
        Omit<HTMLDreamyProps<"div">, keyof InputGroupVariantProps> {}

/**
 * Input Group — wrapper that groups input parts and addons.
 */
const Group = withProvider(function InputGroup(props: InputGroupProps) {
    const [cssProps, { children, ...rest }] = splitCssProps(props);

    return (
        <InputGroupProvider value={rest}>
            <dreamy.div
                data-input-group
                {...cssProps}
            >
                {children}
            </dreamy.div>
        </InputGroupProvider>
    );
}, "root");

export interface InputPrefixProps extends HTMLDreamyProps<"div"> {}

/**
 * Input Prefix — content placed before the input field.
 */
const Prefix = withContext(dreamy.div, "prefix", { defaultProps: { "data-part": "prefix" } });

export interface InputSuffixProps extends HTMLDreamyProps<"div"> {}

/**
 * Input Suffix — content placed after the input field.
 */
const Suffix = withContext(dreamy.div, "suffix", { defaultProps: { "data-part": "suffix" } });

export interface InputStartAddonProps extends HTMLDreamyProps<"div"> {}

/**
 * Input Start Addon — addon attached to the start of the input group.
 */
const StartAddon = withContext(dreamy.div, "startAddon");

export interface InputEndAddonProps extends HTMLDreamyProps<"div"> {}

/**
 * Input End Addon — addon attached to the end of the input group.
 */
const EndAddon = withContext(dreamy.div, "endAddon");

/**
 * Input component — text field for user input.
 *
 * @see Docs https://dreamy-ui.com/docs/components/input
 *
 * @example
 * ```tsx
 * <Input placeholder="Email" />
 * ```
 */
export function Input(props: InputProps) {
    const { onChangeValue, onChange, ...restProps } = props;
    const groupContext = useInputGroup();
    const field = useField(
        useMemo(() => {
            return {
                ...groupContext,
                ...restProps
            };
        }, [groupContext, restProps])
    );

    return (
        <StyledInput
            {...field}
            onChange={callAllHandlers(onChange, function handleChangeValue(
                e: React.ChangeEvent<HTMLInputElement>
            ) {
                onChangeValue?.(e.target.value);
            })}
        />
    );
}

Input.Group = Group;
Input.Prefix = Prefix;
Input.Suffix = Suffix;
Input.StartAddon = StartAddon;
Input.EndAddon = EndAddon;
