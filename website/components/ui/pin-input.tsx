"use client";

import {
    PinInputDescendantsProvider,
    PinInputProvider,
    type UsePinInputProps,
    usePinInput,
    usePinInputField
} from "@dreamy-ui/react";
import { forwardRef } from "react";
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
const PinInputRoot = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(props, ref) {
    const { children, ...rest } = props;
    const [cssProps, otherProps] = splitCssProps(rest);
    const { descendants, ...context } = usePinInput<InputProps, HStackProps>(otherProps);

    return (
        <Box
            {...cssProps}
            data-pin-input
            ref={ref}
        >
            <PinInputDescendantsProvider value={descendants}>
                <PinInputProvider value={context}>{children}</PinInputProvider>
            </PinInputDescendantsProvider>
        </Box>
    );
});

export interface PinInputFieldProps extends InputProps {}

const PinInputField = forwardRef<PinInputFieldProps, InputProps>(
    function PinInputField(props, ref) {
        const inputProps = usePinInputField<InputProps>(props, ref);

        return (
            <Input
                inputType={"pin"}
                {...inputProps}
            />
        );
    }
);

export namespace PinInput {
    export const Root = PinInputRoot;
    export const Field = PinInputField;
}
