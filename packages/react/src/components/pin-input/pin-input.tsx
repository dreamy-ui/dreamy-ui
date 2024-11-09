import { Input, type InputProps } from "@/components/input";
import { HStack, type HStackProps } from "@/components/stack";
import { Fragment, forwardRef, useMemo } from "react";
import {
    PinInputDescendantsProvider,
    PinInputProvider,
    type UsePinInputProps,
    usePinInput,
    usePinInputField
} from "./use-pin-input";

export interface PinInputProps extends UsePinInputProps, Omit<InputProps, keyof UsePinInputProps> {
    /**
     * The children of the pin input component
     */
    children: React.ReactNode;
    /**
     * If `true`, the pin inputs will be wrapped into a `HStack`
     */
    stacked?: boolean;
    /**
     * Props to be passed to the wrapper. Mainly used to customize the `HStack` component, when `stacked` is `true`
     */
    wrapperProps?: HStackProps;
}

/**
 * The `PinInput` component allows to enter a sequence of digits quickly.
 *
 * @see Docs https://dream-ui.com/docs/components/pin-input
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(props, ref) {
    const { children, stacked, wrapperProps, ...inputRestProps } = props;
    const { descendants, getWrapperProps, ...context } = usePinInput(inputRestProps);

    const Wrapper = useMemo(() => (stacked ? HStack : Fragment), [stacked]);

    return (
        <Wrapper
            {...wrapperProps}
            ref={ref}
        >
            <PinInputDescendantsProvider value={descendants}>
                <PinInputProvider value={context}>{children}</PinInputProvider>
            </PinInputDescendantsProvider>
        </Wrapper>
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
