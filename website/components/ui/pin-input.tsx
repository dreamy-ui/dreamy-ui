"use client";

import {
    PinInputDescendantsProvider,
    PinInputProvider,
    type UsePinInputProps,
    usePinInput,
    usePinInputField
} from "@dreamy-ui/react";

import { splitCssProps } from "styled-system/jsx";
import { Box, type BoxProps } from "./box";
import { Input, type InputProps } from "./input";
import type { HStackProps } from "./stack";

export interface PinInputProps
    extends UsePinInputProps,
        Omit<InputProps, keyof UsePinInputProps | keyof BoxProps>,
        Omit<BoxProps, keyof UsePinInputProps> {
    /**
     * The children of the pin input component
     */
    children: React.ReactNode;
}

/**
 * PinInput component
 *
 * @see Docs https://dreamy-ui.com/docs/components/pin-input
 */
export function Root(props: PinInputProps) {
    const { children, ref, ...rest } = props;
    const [cssProps, otherProps] = splitCssProps(rest);
    const { descendants, ...context } = usePinInput<InputProps, HStackProps>(otherProps);

    return (
        <Box
            {...cssProps}
            data-pin-input
            ref={ref}
            role="group"
        >
            <PinInputDescendantsProvider value={descendants}>
                <PinInputProvider value={context}>{children}</PinInputProvider>
            </PinInputDescendantsProvider>
        </Box>
    );
}

export interface PinInputFieldProps extends InputProps {}

export function Field(props: InputProps) {
    const inputProps = usePinInputField(props);

    return (
        <Input
            inputType={"pin"}
            {...inputProps}
        />
    );
}
