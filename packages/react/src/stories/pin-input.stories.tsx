import { PinInput, PinInputField } from "@/components/pin-input";
import type { Meta } from "@storybook/react";

export default {
    title: "Pin Input"
} satisfies Meta;

export function Base() {
    return (
        <PinInput stacked>
            <PinInputField />
            <PinInputField />
            <PinInputField />
        </PinInput>
    );
}

export function Variants() {
    return (
        <>
            <PinInput
                stacked
                variant={"outline"}
            >
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
            <PinInput
                stacked
                variant={"filled"}
            >
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
            <PinInput
                stacked
                variant={"flushed"}
            >
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
        </>
    );
}
