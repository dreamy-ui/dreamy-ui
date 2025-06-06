import { Input, type InputProps } from "@/components/input";
import { Box, type BoxProps } from "@/rsc";
import { forwardRef } from "react";
import { splitCssProps } from "styled-system/jsx";
import {
    PinInputDescendantsProvider,
    PinInputProvider,
    type UsePinInputProps,
    usePinInput,
    usePinInputField
} from "./use-pin-input";

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
 * The `PinInput` component allows to enter a sequence of digits quickly.
 *
 * @see Docs https://dreamy-ui.com/docs/components/pin-input
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(props, ref) {
    const { children, ...rest } = props;
    const [cssProps, otherProps] = splitCssProps(rest);
    const { descendants, ...context } = usePinInput(otherProps);

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

PinInput.displayName = "PinInput";

export interface PinInputFieldProps extends InputProps {}

export const PinInputField = forwardRef<PinInputFieldProps, InputProps>(
    function PinInputField(props, ref) {
        const inputProps = usePinInputField(props, ref);

        return (
            <Input
                inputType={"pin"}
                {...inputProps}
            />
        );
    }
);
