"use client";

import {
    type UserFeedbackProps,
    callAllHandlers,
    copyObjectWithoutKeys,
    createContext,
    useField
} from "@dreamy-ui/react";
import type React from "react";
import { forwardRef, useMemo } from "react";
import { type HTMLDreamyProps, dreamy, splitCssProps } from "styled-system/jsx";
import { type InputVariantProps, input } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { Flex, type FlexProps } from "./flex";

export interface InputProps
    extends Omit<HTMLDreamyProps<"input">, "size">,
        InputVariantProps,
        UserFeedbackProps {
    /**
     * The callback function that is called when the input value changes.
     */
    onChangeValue?: (value: string) => void;
}

const StyledInput = dreamy("input", input);

export const [InputGroupProvider, useInputGroup] = createContext<InputGroupProviderContext>({
    strict: false,
    name: "InputGroupContext"
});

/**
 * Input component
 *
 * @See Docs https://dreamy-ui.com/docs/components/input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const inputGroup = useInputGroup();
    const field = useField(
        useMemo(() => {
            return {
                ...inputGroup,
                ...props
            };
        }, [inputGroup, props])
    );

    return (
        <StyledInput
            ref={ref}
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLInputElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
});

interface InputGroupProviderContext extends InputVariantProps, UserFeedbackProps {}

export interface InputGroupProps extends InputGroupProviderContext, BoxProps {}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
    function InputGroup(props, ref) {
        const [cssProps, rest] = splitCssProps(props);

        return (
            <InputGroupProvider value={copyObjectWithoutKeys(rest, ["children"])}>
                <Box
                    data-input-group={"true"}
                    ref={ref}
                    {...cssProps}
                >
                    {props.children}
                </Box>
            </InputGroupProvider>
        );
    }
);

export interface InputAddonProps extends FlexProps {}

const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(function InputAddon(props, ref) {
    return (
        <Flex
            ref={ref}
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                flex: "0 0 auto",
                width: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
            }}
            {...props}
        />
    );
});

export const InputLeftAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    function InputLeftAddon(props, ref) {
        return (
            <InputAddon
                left={0}
                ref={ref}
                {...props}
            />
        );
    }
);

export const InputRightAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    function InputRightAddon(props, ref) {
        return (
            <InputAddon
                ref={ref}
                right={0}
                {...props}
            />
        );
    }
);
