"use client";

import { type UserFeedbackProps, callAllHandlers, createContext, useField } from "@dreamy-ui/react";
import type React from "react";
import { useMemo } from "react";
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

const [InputGroupProvider, useInputGroup] = createContext<InputGroupProviderContext>({
    strict: false,
    name: "InputGroupContext"
});

/**
 * Input component
 *
 * @See Docs https://dreamy-ui.com/docs/components/input
 */
export function Input(props: InputProps) {
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
            {...field}
            onChange={callAllHandlers(props.onChange, (e: React.ChangeEvent<HTMLInputElement>) =>
                props.onChangeValue?.(e.target.value)
            )}
        />
    );
}

interface InputGroupProviderContext extends InputVariantProps, UserFeedbackProps {}

export function InputElement(props: FlexProps) {
    return (
        <Flex
            bg={"alpha.50"}
            border="1px solid"
            borderColor="border"
            center
            flex={1}
            px={4}
            {...props}
        />
    );
}

export interface InputGroupProps extends InputGroupProviderContext, BoxProps {
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export function InputGroup(props: InputGroupProps) {
    const [cssProps, { children, ...rest }] = splitCssProps(props);

    return (
        <InputGroupProvider value={rest}>
            <Box
                data-input-group={"true"}
                {...cssProps}
                css={{
                    "& > input, & > textarea": {
                        ...(props.leftElement ? { borderStartRadius: "none" } : {}),
                        ...(props.rightElement ? { borderEndRadius: "none" } : {})
                    },
                    ...cssProps.css
                }}
            >
                {props.leftElement && (
                    <InputElement
                        borderRight={"none"}
                        borderStartRadius="l2"
                    >
                        {props.leftElement}
                    </InputElement>
                )}
                {props.children}
                {props.rightElement && (
                    <InputElement
                        borderEndRadius="l2"
                        borderLeft={"none"}
                    >
                        {props.rightElement}
                    </InputElement>
                )}
            </Box>
        </InputGroupProvider>
    );
}

export interface InputAddonProps extends FlexProps {}

function InputAddon(props: InputAddonProps) {
    return (
        <Flex
            {...props}
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                flex: "0 0 auto",
                width: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                ...props.style
            }}
        />
    );
}

export function InputLeftAddon(props: InputAddonProps) {
    return (
        <InputAddon
            left={0}
            {...props}
        />
    );
}

export function InputRightAddon(props: InputAddonProps) {
    return (
        <InputAddon
            right={0}
            {...props}
        />
    );
}
