import { PinInput, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Pin Input"
} satisfies Meta;

export function Base() {
    return (
        <PinInput.Root aria-label="Pin code">
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
            aria-label="Pin code"
            onValueChange={(next) => setPin(next)}
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
            {(["sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
                <PinInput.Root
                    aria-label={`Pin ${size}`}
                    key={size}
                    size={size}
                >
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Root>
            ))}
        </VStack>
    );
}

export function Variants() {
    return (
        <VStack w="full">
            {(["outline", "filled", "flushed", "filledOutline"] as const).map((variant) => (
                <PinInput.Root
                    aria-label={`Pin ${variant}`}
                    key={variant}
                    variant={variant}
                >
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Root>
            ))}
        </VStack>
    );
}

export function Invalid() {
    return (
        <PinInput.Root
            aria-label="Invalid pin"
            invalid
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Disabled() {
    return (
        <PinInput.Root
            aria-label="Disabled pin"
            disabled
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Mask() {
    return (
        <PinInput.Root
            aria-label="Masked pin"
            mask
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function Alphanumeric() {
    return (
        <PinInput.Root
            aria-label="Alphanumeric code"
            pattern="alphanumeric"
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}

export function SplitFields() {
    return (
        <PinInput.Root aria-label="6-digit code">
            <PinInput.Group>
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Group>

            <PinInput.Separator />

            <PinInput.Group>
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Group>
        </PinInput.Root>
    );
}
