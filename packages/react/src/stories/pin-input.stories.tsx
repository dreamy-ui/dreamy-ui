import { PinInput, PinInputField } from "@/components/pin-input";
import type { Meta } from "@storybook/react";

export default {
    title: "Pin Input"
} satisfies Meta;

export function Base() {
    return (
        <PinInput>
            <PinInputField />
            <PinInputField />
            <PinInputField />
        </PinInput>
    );
}

export function Variants() {
    return (
        <>
            <PinInput variant={"outline"}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
            <PinInput variant={"filled"}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
            <PinInput variant={"flushed"}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
        </>
    );
}
