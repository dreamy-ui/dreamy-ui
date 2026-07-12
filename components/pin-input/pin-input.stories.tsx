import { Divider, PinInput, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Pin Input"
} satisfies Meta;

export function Base() {
    return (
        <PinInput.Root>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Controlled() {
    const [pin, setPin] = useState("2137");

    return (
        <PinInput.Root
            onChange={setPin}
            value={pin}
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Sizes() {
    return (
        <VStack w="full">
            <PinInput.Root size="sm">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>

            <PinInput.Root size="md">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>

            <PinInput.Root size="lg">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        </VStack>
    );
}

export function Variants() {
    return (
        <VStack w="full">
            <PinInput.Root variant="outline">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>

            <PinInput.Root variant="filled">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>

            <PinInput.Root variant="flushed">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        </VStack>
    );
}

export function Invalid() {
    return (
        <PinInput.Root isInvalid>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Disabled() {
    return (
        <PinInput.Root isDisabled>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function OTP() {
    return (
        <PinInput.Root otp>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Mask() {
    return (
        <PinInput.Root mask>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Type() {
    return (
        <PinInput.Root type="alphanumeric">
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function ManageFocus() {
    return (
        <PinInput.Root manageFocus={false}>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function AutoFocus() {
    return (
        <PinInput.Root autoFocus>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function SplitFields() {
    return (
        <PinInput.Root>
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />

            <Divider
                h={8}
                mx={2}
                orientation="vertical"
            />

            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}
